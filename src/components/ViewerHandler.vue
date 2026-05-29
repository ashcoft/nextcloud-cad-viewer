<template>
  <div class="cad-viewer-handler">
    <div v-if="loading" class="cad-viewer-loading">
      <div class="spinner"></div>
      <p>{{ appTranslation('Loading CAD Viewer...') }}</p>
    </div>
    <div v-else-if="error" class="cad-viewer-error">
      <p>{{ error }}</p>
      <button v-if="retryUrl" class="button primary" @click="retryLoad">
        {{ appTranslation('Retry') }}
      </button>
    </div>
    <div v-else ref="viewerContainer" class="cad-viewer-canvas"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { generateUrl } from '@nextcloud/router'
import { loadCADViewer, type ViewerInstance } from '../utils/cadLoader'

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
  name: 'CadViewerHandler',
  props: {
    // These props are passed by the Nextcloud Viewer
    path: {
      type: String,
      required: false,
      default: '',
    },
    mime: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)
    const viewerContainer = ref<HTMLElement | null>(null)
    const viewerInstance = ref<ViewerInstance | null>(null)
    const retryUrl = ref<string | null>(null)

    async function initViewer(): Promise<void> {
      if (!props.path) {
        error.value = appTranslation('No file selected. Please open a DWG or DXF file from Nextcloud.')
        loading.value = false
        return
      }

      // Build the URL to fetch file content via the Nextcloud WebDAV endpoint
      // The path is typically like /username/files/folder/file.dwg
      const encodedPath = encodeURIComponent(props.path)
      const fileUrl = generateUrl('/remote.php/webdav{path}', { path: props.path })
        .replace('{path}', encodedPath)

      retryUrl.value = fileUrl

      if (viewerContainer.value) {
        try {
          viewerInstance.value = await loadCADViewer(viewerContainer.value, {
            url: fileUrl,
            theme: 'dark',
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          error.value = appTranslation('Failed to load CAD viewer: ') + msg
        }
      }
    }

    onMounted(async () => {
      try {
        await initViewer()
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        error.value = appTranslation('Failed to load CAD viewer: ') + msg
      } finally {
        loading.value = false
      }
    })

    onBeforeUnmount(() => {
      viewerInstance.value?.dispose()
      viewerInstance.value = null
    })

    async function retryLoad(): Promise<void> {
      error.value = null
      loading.value = true

      if (viewerContainer.value && retryUrl.value) {
        viewerInstance.value?.dispose()
        try {
          viewerInstance.value = await loadCADViewer(viewerContainer.value, {
            url: retryUrl.value,
            theme: 'dark',
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          error.value = appTranslation('Failed to load CAD viewer: ') + msg
        }
      }
      loading.value = false
    }

    return {
      loading,
      error,
      viewerContainer,
      retryUrl,
      retryLoad,
      appTranslation,
    }
  },
})
</script>

<style scoped>
.cad-viewer-handler {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
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

.cad-viewer-canvas {
  flex: 1;
  width: 100%;
  overflow: hidden;
}
</style>