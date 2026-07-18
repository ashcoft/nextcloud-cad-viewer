import { createApp, defineComponent, h, onMounted, onBeforeUnmount, ref, type PropType } from 'vue'
import { registerFileAction, DefaultType } from '@nextcloud/files'
import type { IFileAction } from '@nextcloud/files'
import { generateUrl } from '@nextcloud/router'
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

/**
 * Fetch file content using the load endpoint.
 * Returns metadata and a direct URL for the CAD viewer to fetch the file content.
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

const app = createApp(CadViewerApp)
app.use(router)

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
  <path d="M7 2a2 2 0 0 0-2 2v1H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2V4a2 2 0 0 0-2-2H7zm0 2h10v2H7V4zm0 4h10v2H7V8zm0 4h6v2H7v-2z"/>
</svg>`

// Declare global types for Nextcloud
interface NextcloudOC {
  PERMISSION_READ: number
  generateUrl: (url: string, params?: Record<string, unknown>) => string
  imagePath: (app: string, file: string) => string
}

interface FileInfoType {
  id?: number | string
  path?: string
  directory?: string
  name?: string
  filename?: string
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
  Files?: {
    registerFileAction: (action: {
      name: string
      displayName: string
      mime: string
      permissions: number
      icon: () => string
      actionHandler: (fileName: string, context: { fileInfo?: { id: number | string; path?: string } }) => void
    }) => void
    fileActions?: {
      register: (action: {
        name: string
        displayName: string
        mime: string
        permissions: number
        icon: () => string
        actionHandler: (fileName: string, context: { fileInfo?: { id: number | string; path?: string } }) => void
      }) => void
    }
    setUserValue?: (app: string, key: string, value: string) => void
  }
}

declare const OC: NextcloudOC
declare const OCA: NextcloudOCA

// Track if we've already registered to avoid duplicate registrations
let isRegistered = false

/**
 * Vue 3 handler component for the Nextcloud Viewer API.
 * This component is registered with OCA.Viewer.registerHandler() and
 * lazily loads the heavy CAD viewer bundle only when a CAD file is actually opened.
 *
 * Uses the load endpoint to get a direct file URL for the CAD viewer.
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
     * Load the CAD viewer with a direct file URL.
     */
    async function loadViewerWithUrl(
      container: HTMLElement,
      fileUrl: string,
      fileName: string
    ): Promise<void> {
      try {
        const instance = await loadCADViewer(container, {
          url: fileUrl,
          fileName,
          theme: 'dark',
        })
        // Check if unmounted before assigning
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
          } else {
            raf(checkContainer)
          }
        }
        checkContainer()
      })

      if (isUnmounted.value) return

      // Fetch file URL using load endpoint
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

      // Load viewer with direct URL
      const container = viewerContainer.value
      if (container) {
        await loadViewerWithUrl(container, fileData.url, fileData.name)
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
          await loadViewerWithUrl(viewerContainer.value, fileData.url, fileData.name)
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
 * This enables clicking on DWG/DXF files to open them directly in the CAD viewer.
 */
const MAX_RETRIES = 10
let retryCount = 0

function registerViewerHandler(): boolean {
  if (isRegistered) return true

  if (OCA?.Viewer !== undefined) {
    try {
      OCA.Viewer.registerHandler({
        id: 'cad-viewer',
        group: 'cad',
        mimes: SUPPORTED_MIMES,
        component: CadViewerHandlerComponent,
      })
      isRegistered = true
      console.log('CAD Viewer: Registered handler for Nextcloud Viewer')
      return true
    } catch (err) {
      console.error('CAD Viewer: Failed to register handler', err)
      return false
    }
  }

  // Viewer API not yet available, schedule retry with bounded attempts
  if (retryCount < MAX_RETRIES && typeof setTimeout !== 'undefined') {
    retryCount++
    setTimeout(registerViewerHandler, 1000)
  } else if (retryCount >= MAX_RETRIES) {
    console.warn('CAD Viewer: Max retries reached, Viewer app may not be available')
  }
  return false
}

/**
 * Open the CAD viewer inline for a file using the Nextcloud Viewer API.
 */
function openInViewer(fileId: number | string): void {
  if (OCA?.Viewer?.open !== undefined) {
    OCA.Viewer.open({ fileId })
    return
  }

  if (OC !== undefined) {
    window.location.href = OC.generateUrl('/apps/cad_viewer/view') + '?fileIds=' + fileId
  }
}

/**
 * Register file actions that appear in the Files "..." context menu.
 */
function registerFileActions(): void {
  if (typeof OC === 'undefined') {
    return
  }

  try {
    const action: IFileAction = {
      id: 'cad-viewer-open',
      displayName: () => t('cad_viewer', 'Open with CAD Viewer'),
      iconSvgInline: () => CAD_VIEWER_ICON,
      enabled: ({ nodes }) => nodes.length === 1 && nodes.some((node) => SUPPORTED_MIMES.includes(node.mime)),
      exec: async ({ nodes }) => {
        const node = nodes[0]
        const fileId = node.id
        if (fileId !== undefined) {
          openInViewer(fileId)
        }
        return null
      },
      default: DefaultType.HIDDEN,
    }
    registerFileAction(action)
    console.log('CAD Viewer: Registered file actions')
  } catch (err) {
    console.error('CAD Viewer: Failed to register file actions', err)
  }
}

/**
 * Initialize the CAD viewer app.
 */
function init(): void {
  console.log('CAD Viewer: Initializing...')
  registerFileActions()
  registerViewerHandler()

  // Mount the app if we're in the CAD viewer route
  const mountEl =
    document.getElementById('cad-viewer-app') ??
    document.getElementById('cad-viewer-container')

  if (mountEl) {
    app.mount(mountEl)
  }
}

// Register when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// Also re-register on Nextcloud Files ready event
document.addEventListener('nextcloud-files-ready', () => {
  console.log('CAD Viewer: Nextcloud Files ready, re-registering...')
  registerFileActions()
  registerViewerHandler()
})

export default app