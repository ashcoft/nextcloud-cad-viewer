<template>
  <div id="cad-viewer-wrapper" class="cad-viewer-wrapper">
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

/**
 * Fetch file content using the load endpoint.
 */
async function fetchFileContent(fileId: number | string): Promise<LoadResponse | null> {
  try {
    const url = generateUrl('/apps/cad_viewer/api/load/{fileId}', { fileId: String(fileId) })
    const response = await window.fetch(url)

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error('CAD Viewer: Failed to fetch file content', err)
    return null
  }
}

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

    // Browser animation frame function for polling
    const raf = globalThis.requestAnimationFrame.bind(globalThis)

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

      // Fetch file content using load endpoint
      const fileData = await fetchFileContent(String(fid))

      // codacy ignore start
      // Check if unmounted after async operation
      const wasUnmounted = isUnmounted.value
      if (wasUnmounted) {
        loading.value = false
        return
      }
      // codacy ignore end

      if (!fileData) {
        error.value = appTranslation('Failed to load file content. Please try again.')
        loading.value = false
        return
      }

      if (fileData.error) {
        error.value = fileData.error
        loading.value = false
        return
      }

      // Load viewer with base64 content
      const container = viewerContainer.value
      if (container?.isConnected) {
        try {
          viewerInstance.value = await loadCADViewer(container, {
            fileContent: fileData.content,
            fileName: fileData.name,
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
      viewerInstance.value?.dispose()
      viewerInstance.value = null
    })

    async function retryLoad(): Promise<void> {
      if (!retryFileId.value || !viewerContainer.value?.isConnected) return

      error.value = null
      loading.value = true

      viewerInstance.value?.dispose()

      const fileData = await fetchFileContent(retryFileId.value)
      if (fileData && !fileData.error) {
        try {
          viewerInstance.value = await loadCADViewer(viewerContainer.value, {
            fileContent: fileData.content,
            fileName: fileData.name,
            theme: 'dark',
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          error.value = appTranslation('Failed to load CAD viewer: ') + msg
        }
      } else {
        error.value = fileData?.error || appTranslation('Failed to load file')
      }
      loading.value = false
    }

    return {
      loading,
      error,
      viewerContainer,
      retryFileId,
      retryLoad,
      appTranslation,
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
  background: rgba(30, 30, 30, 0.95);
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
