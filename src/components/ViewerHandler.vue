<template>
  <div class="cad-viewer-handler">
    <div ref="viewerContainer" class="cad-viewer-canvas">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { generateUrl } from '@nextcloud/router'
import { loadCADViewer, type ViewerInstance } from '../utils/cadLoader'

// Global translation function from Nextcloud
function t(app: string, text: string): string {
  const nextcloudGlobal = globalThis as unknown as { t?: (app: string, text: string) => string }
  const nextcloudTranslate = nextcloudGlobal.t
  return nextcloudTranslate ? nextcloudTranslate(app, text) : text
}

// Browser animation frame function type
const raf = globalThis.requestAnimationFrame.bind(globalThis)

const appTranslation = (text: string) => t('cad_viewer', text)

// Define props interface for Nextcloud Viewer
interface ViewerProps {
  path?: string
  fileid?: number | string
  mime?: string
  filename?: string
  source?: string
  davPath?: string
}

export default defineComponent({
  name: 'CadViewerHandler',
  props: {
    // These props are passed by the Nextcloud Viewer
    path: {
      type: String,
      required: false,
      default: '',
    },
    fileid: {
      type: [Number, String],
      required: false,
      default: null,
    },
    mime: {
      type: String,
      required: false,
      default: '',
    },
    filename: {
      type: String,
      required: false,
      default: '',
    },
    source: {
      type: String,
      required: false,
      default: '',
    },
    davPath: {
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

    // Compute the actual file path to use
    const filePath = computed(() => {
      // First try prop.path
      if (props.path) return props.path
      // Then try fileInfo.path
      if (props.fileInfo?.path) return props.fileInfo.path
      // Build from directory and filename if available
      if (props.fileInfo?.directory && props.fileInfo?.name) {
        return props.fileInfo.directory + '/' + props.fileInfo.name
      }
      // Finally try filename directly
      if (props.fileInfo?.filename) return props.fileInfo.filename
      if (props.fileInfo?.name) return props.fileInfo.name
      return ''
    })

    // Compute the file URL for the CAD viewer
    const fileUrl = computed(() => {
      const path = filePath.value
      if (!path) return ''

      // Use the backend API to get file content
      const fileId = props.fileInfo?.id
      if (fileId) {
        return generateUrl('/apps/cad_viewer/api/file/{fileId}/content', { fileId: String(fileId) })
      }

      // Fallback to WebDAV if no file ID
      const pathSegments = path.split('/').filter(Boolean)
      const encodedSegments = pathSegments.map((segment) => encodeURIComponent(segment))
      return generateUrl('/remote.php/webdav') + '/' + encodedSegments.join('/')
    })

    async function initViewer(): Promise<void> {
      // Determine the file URL to use
      let fileUrl: string | null = null
      
      // Priority 1: Use fileid with the app's API endpoint
      const fileId = props.fileid
      if (fileId) {
        fileUrl = generateUrl('/apps/cad_viewer/api/file/{fileId}/content', { fileId: String(fileId) })
        retryUrl.value = fileUrl
      }
      
      // Priority 2: Fallback to source if provided
      if (!fileUrl && props.source) {
        fileUrl = props.source
        retryUrl.value = fileUrl
      }
      
      // Priority 3: Fallback to davPath with WebDAV
      if (!fileUrl && props.davPath) {
        const pathSegments = props.davPath.split('/').filter(Boolean)
        const encodedSegments = pathSegments.map((segment) => encodeURIComponent(segment))
        fileUrl = generateUrl('/remote.php/webdav') + '/' + encodedSegments.join('/')
        retryUrl.value = fileUrl
      }
      
      // Priority 4: Fallback to path with WebDAV
      if (!fileUrl && props.path) {
        const pathSegments = props.path.split('/').filter(Boolean)
        const encodedSegments = pathSegments.map((segment) => encodeURIComponent(segment))
        fileUrl = generateUrl('/remote.php/webdav') + '/' + encodedSegments.join('/')
        retryUrl.value = fileUrl
      }

      if (!fileUrl) {
        error.value = appTranslation('No file selected. Please open a DWG or DXF file from Nextcloud.')
        loading.value = false
        return
      }

      // Wait for container to be in the DOM
      await new Promise<void>((resolve) => {
        const checkContainer = () => {
          const container = viewerContainer.value
          if (container && container.isConnected) {
            resolve()
          } else {
            raf(checkContainer)
          }
        }
        checkContainer()
      })

      if (viewerContainer.value) {
        try {
          // Load the CAD viewer with the file URL
          // The axios request will include session cookies automatically
          viewerInstance.value = await loadCADViewer(viewerContainer.value, {
            url: fileUrl,
            theme: 'dark',
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          error.value = appTranslation('Failed to load CAD viewer: ') + msg
        }
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

.cad-viewer-canvas {
  flex: 1;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.cad-viewer-loading,
.cad-viewer-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #fff;
  gap: 1rem;
  background: #1e1e1e;
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