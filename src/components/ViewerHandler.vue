<template>
  <div class="cad-viewer-handler">
    <div ref="viewerContainer" class="cad-viewer-canvas">
      <div v-if="loading" class="cad-viewer-loading">
        <div class="spinner"></div>
        <p>{{ t('cad_viewer', 'Loading CAD Viewer...') }}</p>
      </div>
      <div v-else-if="error" class="cad-viewer-error">
        <p>{{ error }}</p>
        <button v-if="retryUrl" class="button primary" @click="retryLoad">
          {{ t('cad_viewer', 'Retry') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, type PropType } from 'vue'
import { generateUrl } from '@nextcloud/router'
import { loadCADViewer, type ViewerInstance } from '../utils/cadLoader'

interface FileInfoType {
  id?: number | string
  path?: string
  directory?: string
  name?: string
  filename?: string
}

const t = (app: string, text: string): string => {
  const translate = (globalThis as { t?: (app: string, text: string) => string }).t
  return translate ? translate(app, text) : text
}

const raf = globalThis.requestAnimationFrame.bind(globalThis)

export default defineComponent({
  name: 'CadViewerHandler',
  props: {
    path: {
      type: String,
      default: '',
    },
    fileid: {
      type: [Number, String],
      default: null,
    },
    mime: {
      type: String,
      default: '',
    },
    filename: {
      type: Object as PropType<FileInfoType | null>,
      default: null,
    },
    source: {
      type: String,
      default: '',
    },
    davPath: {
      type: String,
      default: '',
    },
    fileInfo: {
      type: Object as PropType<FileInfoType | null>,
      default: null,
    },
  },
  setup(props) {
    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)
    const viewerContainer = ref<HTMLElement | null>(null)
    const viewerInstance = ref<ViewerInstance | null>(null)
    const retryUrl = ref<string | null>(null)

    async function initViewer(): Promise<void> {
      let fileUrl: string | null = null

      // Priority 1: Use fileid prop
      let fileId = props.fileid
      if (!fileId && props.fileInfo?.id) {
        fileId = props.fileInfo.id
      }
      if (fileId) {
        fileUrl = generateUrl('/apps/cad_viewer/api/file/{fileId}/content', { fileId: String(fileId) })
        retryUrl.value = fileUrl
      }

      // Priority 2: Use source
      if (!fileUrl && props.source) {
        fileUrl = props.source
        retryUrl.value = fileUrl
      }

      // Priority 3: Use davPath
      if (!fileUrl && props.davPath) {
        const pathSegments = props.davPath.split('/').filter(Boolean)
        const encodedSegments = pathSegments.map((segment) => encodeURIComponent(segment))
        fileUrl = generateUrl('/remote.php/webdav') + '/' + encodedSegments.join('/')
        retryUrl.value = fileUrl
      }

      // Priority 4: Use path
      if (!fileUrl && props.path) {
        const pathSegments = props.path.split('/').filter(Boolean)
        const encodedSegments = pathSegments.map((segment) => encodeURIComponent(segment))
        fileUrl = generateUrl('/remote.php/webdav') + '/' + encodedSegments.join('/')
        retryUrl.value = fileUrl
      }

      if (!fileUrl) {
        error.value = t('cad_viewer', 'No file selected. Please open a DWG or DXF file from Nextcloud.')
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
          viewerInstance.value = await loadCADViewer(viewerContainer.value, {
            url: fileUrl,
            theme: 'dark',
          })
        } catch (err) {
          error.value = t('cad_viewer', 'Failed to load CAD viewer: ') + (err instanceof Error ? err.message : String(err))
        }
      }
      loading.value = false
    }

    onMounted(async () => {
      try {
        await initViewer()
      } catch (err) {
        error.value = t('cad_viewer', 'Failed to load CAD viewer: ') + (err instanceof Error ? err.message : String(err))
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
          error.value = t('cad_viewer', 'Failed to load CAD viewer: ') + (err instanceof Error ? err.message : String(err))
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
      t,
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