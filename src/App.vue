<template>
  <div id="cad-viewer-wrapper" class="cad-viewer-wrapper">
    <div v-if="loading" class="cad-viewer-loading">
      <div class="spinner"></div>
      <p>{{ appTranslation('Loading CAD Viewer...') }}</p>
    </div>
    <div v-else-if="error" class="cad-viewer-error">
      <p>{{ error }}</p>
      <button v-if="fileUrl" class="button primary" @click="retryLoad">
        {{ appTranslation('Retry') }}
      </button>
    </div>
    <div v-else ref="viewerContainer" class="cad-viewer-canvas"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { generateUrl } from '@nextcloud/router'
import { loadCADViewer, type ViewerInstance } from './utils/cadLoader'

// Global translation function from Nextcloud
declare global {
  interface Window {
    t: (app: string, text: string) => string
  }
}

const t = (app: string, text: string) => {
  return (window as any).t ? (window as any).t(app, text) : text
}

// Use the new app ID for translations
const appTranslation = (text: string) => t('nextcloud-cad-viewer', text)

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
    const fileUrl = ref<string | null>(null)

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

      fileUrl.value = generateUrl('/apps/nextcloud-cad-viewer/api/file/{fileId}/content', { fileId: fid as string })

      if (viewerContainer.value) {
        viewerInstance.value = await loadCADViewer(viewerContainer.value, {
          url: fileUrl.value,
          theme: 'dark',
        })
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

      if (viewerContainer.value && fileUrl.value) {
        viewerInstance.value?.dispose()
        try {
          viewerInstance.value = await loadCADViewer(viewerContainer.value, {
            url: fileUrl.value,
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
      fileUrl,
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
