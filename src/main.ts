import { createApp, defineComponent, h, onMounted, onBeforeUnmount, ref, type PropType } from 'vue'
import { registerFileAction, DefaultType, FileAction } from '@nextcloud/files'
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import CadViewerApp from './App.vue'
import router from './router'
import { loadCADViewer, type ViewerInstance } from './utils/cadLoader'
import type { LoadResponse } from './types/loadResponse'

// Type alias for file ID
type FileIdType = number | string | null

// Global translation function from Nextcloud - must be declared before use
const t = (app: string, text: string): string => {
  const nextcloudGlobal = globalThis as unknown as { t?: (app: string, text: string) => string }
  const nextcloudTranslate = nextcloudGlobal.t
  return nextcloudTranslate ? nextcloudTranslate(app, text) : text
}

const app = createApp(CadViewerApp)
app.use(router)

// Supported MIME types for CAD files
const SUPPORTED_MIMES = [
  'application/acad',
  'application/autocad_dwg',
  'application/dwg',
  'application/x-autocad',
  'application/x-dwg',
  'image/vnd.dwg',
  'image/vnd.dxf',
  'application/dxf',
  'application/x-dxf',
  'image/x-dxf',
]

// CAD Viewer icon as inline SVG
const CAD_VIEWER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6zm2-8h2v2H8v-2zm0-2h2v2H8v-2zm4 4h2v2h-2v-2zm0-2h2v2h-2v-2zm4-2h2v4h-2v-4z"/>
</svg>`

/**
 * Fetch file content using the load endpoint.
 * Returns base64 encoded content similar to draw.io approach.
 */
async function fetchFileContent(fileId: number | string): Promise<LoadResponse | null> {
  try {
    const url = generateUrl('/apps/cad_viewer/api/load/{fileId}', { fileId: String(fileId) })
    const response = await fetch(url)

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

// Declare global types for Nextcloud
interface FileInfoType {
  id?: number | string
  path?: string
  directory?: string
  name?: string
  filename?: string
  mime?: string
}

interface NextcloudOCAViewer {
  id?: string
  group?: string
  mimes: string[]
  component: unknown
}

interface NextcloudOCA {
  Viewer?: {
    registerHandler: (handler: NextcloudOCAViewer) => void
    open: (options: { path?: string; fileId?: number | string }) => boolean
  }
}

declare const OCA: NextcloudOCA

// Track if we've already registered to avoid duplicate registrations
let isViewerRegistered = false
let isFileActionRegistered = false

/**
 * Vue 3 handler component for the Nextcloud Viewer API.
 * This component is registered with OCA.Viewer.registerHandler() and
 * lazily loads the heavy CAD viewer bundle only when a CAD file is actually opened.
 */
const CadViewerHandlerComponent = defineComponent({
  name: 'CadViewerHandler',
  props: {
    path: {
      type: String,
      required: false,
      default: '',
    },
    fileid: {
      type: [Number, String] as PropType<FileIdType>,
      required: false,
      default: null,
    },
    mime: {
      type: String,
      required: false,
      default: '',
    },
    filename: {
      type: Object as PropType<FileInfoType | null>,
      required: false,
      default: null,
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
    fileInfo: {
      type: Object as PropType<FileInfoType | null>,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)
    const viewerContainer = ref<HTMLElement | null>(null)
    const viewerInstance = ref<ViewerInstance | null>(null)
    const retryFileId = ref<number | string | null>(null)
    const isUnmounted = ref(false)

    const appTranslation = (text: string) => t('cad_viewer', text)

    // Browser animation frame function type
    const raf = globalThis.requestAnimationFrame.bind(globalThis)

    /**
     * Resolve the file ID from props.
     * Priority: fileid > fileInfo.id
     */
    function resolveFileId(): number | string | null {
      if (props.fileid !== null) {
        return props.fileid
      }
      return props.fileInfo?.id ?? null
    }

    /**
     * Load the CAD viewer with base64 file content.
     */
    async function loadViewerWithContent(
      container: HTMLElement,
      fileContent: string,
      fileName: string
    ): Promise<void> {
      try {
        const instance = await loadCADViewer(container, {
          fileContent,
          fileName,
          theme: 'dark',
        })
        if (isUnmounted.value) {
          instance.dispose()
          return
        }
        viewerInstance.value = instance
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        error.value = appTranslation('Failed to load CAD viewer: ') + msg
      }
    }

    async function initViewer(): Promise<void> {
      const fileId = resolveFileId()

      if (!fileId) {
        error.value = appTranslation('No file selected. Please open a DWG or DXF file from Nextcloud.')
        loading.value = false
        return
      }

      retryFileId.value = fileId

      // Wait for container to be in the DOM
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

      if (isUnmounted.value) return

      // Fetch file content using load endpoint
      const fileData = await fetchFileContent(fileId)

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
      if (container) {
        await loadViewerWithContent(container, fileData.content, fileData.name)
      } else {
        error.value = appTranslation('Failed to initialize viewer container.')
        loading.value = false
        return
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
      if (!retryFileId.value) return

      error.value = null
      loading.value = true

      if (viewerContainer.value) {
        viewerInstance.value?.dispose()

        const fileData = await fetchFileContent(retryFileId.value)
        if (fileData && !fileData.error) {
          await loadViewerWithContent(viewerContainer.value, fileData.content, fileData.name)
        } else {
          error.value = fileData?.error || appTranslation('Failed to load file')
        }
      }
      loading.value = false
    }

    return () => {
      // Build overlay children only when needed
      const overlayChildren: ReturnType<typeof h>[] = []
      if (loading.value) {
        overlayChildren.push(
          h('div', { class: 'cad-viewer-loading' }, [
            h('div', { class: 'spinner' }),
            h('p', {}, appTranslation('Loading CAD Viewer...')),
          ]),
        )
      }
      if (error.value) {
        const errorContent: ReturnType<typeof h>[] = [h('p', {}, error.value)]
        if (retryFileId.value) {
          errorContent.push(
            h('button', {
              class: 'button primary',
              onClick: retryLoad,
            }, appTranslation('Retry')),
          )
        }
        overlayChildren.push(h('div', { class: 'cad-viewer-error' }, errorContent))
      }
      const overlay = overlayChildren.length > 0
        ? h('div', { class: 'cad-viewer-overlay' }, overlayChildren)
        : null

      return h('div', { class: 'cad-viewer-handler' }, [
        h('div', { ref: viewerContainer, class: 'cad-viewer-canvas' }),
        overlay,
      ])
    }
  },
})

/**
 * Register the CAD viewer handler with the Nextcloud Viewer API.
 */
function registerViewerHandler(): boolean {
  if (isViewerRegistered) return false

  if (OCA?.Viewer !== undefined) {
    OCA.Viewer.registerHandler({
      id: 'cad-viewer',
      group: 'cad',
      mimes: SUPPORTED_MIMES,
      component: CadViewerHandlerComponent,
    })
    isViewerRegistered = true
    console.debug('CAD Viewer: Registered with Nextcloud Viewer')
    return true
  }
  return false
}

/**
 * Open the CAD viewer inline for a file using the Nextcloud Viewer API.
 * Similar to draw.io approach - opens the file directly in the viewer.
 */
function openInViewer(fileId: number | string): void {
  if (OCA?.Viewer?.open !== undefined) {
    OCA.Viewer.open({ fileId })
    return
  }

  // Fallback: navigate to the viewer page
  window.location.href = generateUrl('/apps/cad_viewer/view') + '?fileIds=' + fileId
}

/**
 * Register file actions that appear in the Files "..." context menu and as default action.
 * Following the draw.io pattern for seamless integration.
 */
function registerFileActions(): void {
  if (isFileActionRegistered) return

  try {
    // Create the file action for opening CAD files
    const action = new FileAction({
      id: 'cad-viewer-open',
      displayName: () => t('cad_viewer', 'Open with CAD Viewer'),
      iconSvgInline: () => CAD_VIEWER_ICON,
      enabled: ({ nodes }) => {
        // Only enable for single file selection with supported MIME type
        return nodes.length === 1 && nodes[0].mime !== undefined && SUPPORTED_MIMES.includes(nodes[0].mime)
      },
      exec: async (selectedNodes) => {
        const node = selectedNodes[0]
        const fileId = node.id
        if (fileId !== undefined) {
          openInViewer(fileId)
        }
        return null
      },
      // Set as default action (shown in main click action)
      default: DefaultType.AVAILABLE,
      // Higher priority than default file actions
      order: 50,
    })

    // Register for each supported MIME type
    for (const mime of SUPPORTED_MIMES) {
      registerFileAction(action, mime)
    }

    isFileActionRegistered = true
    console.debug('CAD Viewer: Registered file actions for DWG/DXF files')
  } catch (err) {
    console.error('CAD Viewer: Failed to register file actions', err)
  }
}

// Set up polling to ensure registration happens when OCA.Viewer becomes available
function setupRegistration(): void {
  // Try to register immediately
  if (registerViewerHandler() && registerFileActions()) {
    return
  }

  // Poll every 100ms for up to 10 seconds
  let pollCount = 0
  const maxPolls = 100

  const pollInterval = setInterval(() => {
    const viewerRegistered = registerViewerHandler()
    const fileActionsRegistered = registerFileActions()

    if (viewerRegistered && fileActionsRegistered) {
      clearInterval(pollInterval)
      return
    }

    pollCount++
    if (pollCount >= maxPolls) {
      clearInterval(pollInterval)
      console.debug('CAD Viewer: Registration timeout - some features may not be available')
    }
  }, 100)
}

// Initialize registration when script loads
setupRegistration()

// Re-register on Nextcloud Files ready event (for dynamic navigation)
document.addEventListener('nextcloud-files-ready', () => {
  registerFileActions()
  registerViewerHandler()
})

// Mount Vue app if container exists
document.addEventListener('DOMContentLoaded', () => {
  const mountEl =
    document.getElementById('cad-viewer-app') ??
    document.getElementById('cad-viewer-container')

  if (mountEl) {
    app.mount(mountEl)
  }
})

export default app