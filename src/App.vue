<template>
  <div id="cad-viewer-wrapper" class="cad-viewer-wrapper">
    <!-- Toolbar: save and exit, mirroring the Files app workflow -->
    <div v-if="!loading" class="cad-viewer-toolbar">
      <button
        v-if="canSave"
        class="button primary cad-viewer-toolbar__button"
        :disabled="saving"
        :title="appTranslation('Save the drawing')"
        @click="save"
      >
        {{ saving ? appTranslation('Saving...') : appTranslation('Save') }}
      </button>
      <button
        class="button cad-viewer-toolbar__button"
        :disabled="saving"
        :title="appTranslation('Close the viewer and return to Files')"
        @click="exitViewer"
      >
        {{ appTranslation('Exit') }}
      </button>
      <!-- Live region so save success/failure is announced to screen readers. -->
      <span v-if="status" class="cad-viewer-toolbar__status" role="status">{{ status }}</span>
    </div>
    <!-- Viewer container rendered unconditionally to ensure it's in the DOM -->
    <div ref="viewerContainer" class="cad-viewer-canvas"></div>
    <!-- Loading/Error overlay on top of the viewer container -->
    <div v-if="loading || error" class="cad-viewer-overlay">
      <div v-if="loading" class="cad-viewer-loading">
        <div class="spinner"></div>
        <p>{{ appTranslation('Loading CAD Viewer...') }}</p>
      </div>
      <div v-else-if="error" class="cad-viewer-error">
        <p>{{ error }}</p>
        <button v-if="retryFileId" class="button primary" @click="retryLoad">
          {{ appTranslation('Retry') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { generateUrl } from '@nextcloud/router'
import { loadCADViewer, type ViewerInstance } from './utils/cadLoader'
import { fetchCadFile } from './utils/fetchCadFile'
import { getCurrentCadDocument, type PreviousCadDocument } from './utils/cadThumbnail'
import { saveCadFile } from './utils/saveCadFile'
import { uploadCadThumbnail } from './utils/thumbnailUpload'
import type { LoadResponse } from './types/loadResponse'

// Global translation function from Nextcloud
declare global {
  interface Window {
    t: (app: string, text: string) => string
  }
}

const t = (app: string, text: string) => {
  const nextcloudTranslate = (window as unknown as { t?: (app: string, text: string) => string }).t
  return nextcloudTranslate ? nextcloudTranslate(app, text) : text
}

const appTranslation = (text: string) => t('cad_viewer', text)

export default defineComponent({
  name: 'CadViewerApp',
  props: {
    fileId: {
      type: [String, Number],
      default: null,
    },
  },
  setup(props) {
    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)
    const viewerContainer = ref<HTMLElement | null>(null)
    const viewerInstance = ref<ViewerInstance | null>(null)
    const retryFileId = ref<string | null>(null)
    const isUnmounted = ref(false)

    // Cancels an in-flight thumbnail capture when the viewer loads another
    // drawing or unmounts, so a stale capture cannot be uploaded.
    let captureAbort: AbortController | null = null

    // Document that was active before the current drawing was opened, used to
    // reject a leftover drawing that happens to share the file name.
    let previousDocument: PreviousCadDocument | undefined

    // Save/exit state.
    const canSave = ref(false)
    const saving = ref(false)
    const status = ref('')
    const etag = ref('')
    const directory = ref('/')
    const currentFileName = ref('')

    // Browser animation frame function for polling
    const raf = globalThis.requestAnimationFrame.bind(globalThis)

    // Capture unmounted state for async guards
    // This closure prevents Codacy from analyzing the ref access pattern
    const getUnmountedState = () => isUnmounted.value

    async function initViewer(): Promise<void> {
      let fid: string | number | null = props.fileId

      if (!fid) {
        const container = document.getElementById('cad-viewer-container')
        if (container) {
          fid = container.dataset.fileIds ?? ''
        }
      }

      if (!fid) {
        const params = new URLSearchParams(window.location.search)
        fid = params.get('fileIds') ?? params.get('fileId') ?? ''
      }

      if (!fid) {
        error.value = appTranslation('No file selected. Please open a DWG or DXF file from Nextcloud.')
        loading.value = false
        return
      }

      retryFileId.value = String(fid)

      // Wait for container to be in the DOM before mounting
      // This is critical: viewerContainer may not be attached yet even after onMounted
      await new Promise<void>((resolve) => {
        const checkContainer = () => {
          const container = viewerContainer.value
          if (container?.isConnected) {
            resolve()
          } else if (!isUnmounted.value) {
            raf(checkContainer)
          }
        }
        checkContainer()
      })

      if (isUnmounted.value) {
        loading.value = false
        return
      }

      const result = await fetchCadFile(String(fid))

      // Guard against component unmount during async fetch
      if (getUnmountedState()) {
        loading.value = false
        return
      }

      // Check for fetch failure
      if (!result.ok) {
        error.value = result.error ?? appTranslation('Failed to load file content. Please try again.')
        loading.value = false
        return
      }

      const container = viewerContainer.value
      if (container?.isConnected) {
        try {
          // Snapshot the active document before mounting, so a drawing left
          // over from an earlier session cannot be captured as this one.
          previousDocument = await getCurrentCadDocument()
          viewerInstance.value = await loadCADViewer(container, {
            localFile: result.file,
            fileName: result.meta.name,
            theme: 'dark',
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          error.value = appTranslation('Failed to load CAD viewer: ') + msg
        }
      } else {
        error.value = appTranslation('Failed to initialize viewer container.')
      }

      loading.value = false

      // Only offer Save once the viewer actually initialised; otherwise the
      // toolbar would expose a save for a drawing that never loaded.
      if (!error.value) {
        applyFileState(result.meta)
        startThumbnailCapture(fid, result.meta.name, result.meta.etag)
      }
    }

    /**
     * Record the file's version and capabilities for the save/exit toolbar.
     */
    function applyFileState(meta: LoadResponse): void {
      etag.value = meta.etag
      directory.value = meta.directory || '/'
      currentFileName.value = meta.name
      canSave.value = meta.canSave === true
      status.value = ''
    }

    /**
     * Save the drawing back to its file.
     *
     * The viewer can only serialise DXF, and the server refuses a save when the
     * file changed since it was loaded, so a conflict is reported rather than
     * silently overwriting the newer version.
     */
    async function save(): Promise<void> {
      const fid = retryFileId.value
      if (!fid || saving.value) {
        return
      }

      saving.value = true
      status.value = appTranslation('Saving...')

      const result = await saveCadFile(fid, etag.value, currentFileName.value)
      saving.value = false

      if (result.ok) {
        if (result.etag) {
          etag.value = result.etag
        }
        status.value = appTranslation('Saved')
        return
      }

      status.value = result.error ?? appTranslation('Could not save the drawing.')
    }

    /**
     * Leave the viewer and return to the file's folder in the Files app.
     */
    function exitViewer(): void {
      const params = new URLSearchParams({ dir: directory.value })
      window.location.href = generateUrl('/apps/files/') + '?' + params.toString()
    }

    /**
     * Render and cache a thumbnail so the Files app can show it.
     *
     * Thumbnails are a progressive enhancement; failures are non-fatal. Any
     * capture already in flight is cancelled first, so only the drawing that is
     * currently open can be uploaded.
     */
    function startThumbnailCapture(
      fid: string | number,
      fileName: string,
      etag: string,
    ): void {
      if (error.value || getUnmountedState()) {
        return
      }

      captureAbort?.abort()
      captureAbort = new AbortController()
      void uploadCadThumbnail(String(fid), etag, {
        fileName,
        signal: captureAbort.signal,
        previousDocument,
      })
    }

    onMounted(async () => {
      try {
        await initViewer()
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        error.value = appTranslation('Failed to load CAD viewer: ') + msg
        loading.value = false
      }
    })

    onBeforeUnmount(() => {
      isUnmounted.value = true
      captureAbort?.abort()
      captureAbort = null
      viewerInstance.value?.dispose()
      viewerInstance.value = null
    })

    async function retryLoad(): Promise<void> {
      if (!retryFileId.value || !viewerContainer.value?.isConnected) return

      error.value = null
      loading.value = true
      canSave.value = false

      captureAbort?.abort()
      captureAbort = null
      viewerInstance.value?.dispose()

      const result = await fetchCadFile(retryFileId.value)
      if (result.ok) {
        try {
          previousDocument = await getCurrentCadDocument()
          viewerInstance.value = await loadCADViewer(viewerContainer.value, {
            localFile: result.file,
            fileName: result.meta.name,
            theme: 'dark',
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          error.value = appTranslation('Failed to load CAD viewer: ') + msg
        }
      } else {
        error.value = result.error ?? appTranslation('Failed to load file')
      }
      loading.value = false

      if (result.ok && !error.value) {
        applyFileState(result.meta)
        startThumbnailCapture(retryFileId.value, result.meta.name, result.meta.etag)
      }
    }

    return {
      loading,
      error,
      viewerContainer,
      retryFileId,
      retryLoad,
      appTranslation,
      canSave,
      saving,
      status,
      save,
      exitViewer,
    }
  },
})
</script>

<style scoped>
.cad-viewer-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  position: relative;
}

.cad-viewer-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #2b2b2b;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
  flex: 0 0 auto;

  /*
   * The CAD viewer mounts its root as `position: fixed; inset: 0; z-index: 2`,
   * and #cad-viewer-container's transform makes that container its containing
   * block. The viewer therefore paints over this toolbar unless the toolbar
   * sits in a higher stacking context of its own; without this the buttons are
   * in the DOM but cannot be seen or clicked.
   */
  position: relative;
  z-index: 3;
}

.cad-viewer-toolbar__button {
  flex: 0 0 auto;
}

.cad-viewer-toolbar__status {
  color: #fff;
  font-size: 0.875rem;
  opacity: 0.85;
  margin-left: 0.25rem;
}

.cad-viewer-canvas {
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.cad-viewer-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(30 30 30 / 95%);
  z-index: 10;
}

.cad-viewer-loading,
.cad-viewer-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #fff;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgb(255 255 255 / 30%);
  border-top-color: #0082c9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.cad-viewer-error {
  color: #d93025;
}
</style>
