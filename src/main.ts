import { createApp, defineComponent, h, onMounted, onBeforeUnmount, ref, type PropType } from 'vue'
import { registerFileAction, DefaultType } from '@nextcloud/files'
import type { IFileAction } from '@nextcloud/files'
import { generateUrl } from '@nextcloud/router'
import CadViewerApp from './App.vue'
import router from './router'
import { loadCADViewer, type ViewerInstance } from './utils/cadLoader'

// Global translation function from Nextcloud - must be declared before use
const t = (app: string, text: string): string => {
  const nextcloudGlobal = globalThis as unknown as { t?: (app: string, text: string) => string }
  const nextcloudTranslate = nextcloudGlobal.t
  return nextcloudTranslate ? nextcloudTranslate(app, text) : text
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
 * The Nextcloud Viewer app in Nextcloud 33+ has been migrated to Vue 3,
 * so Vue 3 components can be rendered directly. This component uses
 * the Composition API and defines props compatible with the Viewer's
 * file handler interface.
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
    const retryUrl = ref<string | null>(null)
    let isUnmounted = false

    const appTranslation = (text: string) => t('cad_viewer', text)

    // Browser animation frame function type
    const raf = globalThis.requestAnimationFrame.bind(globalThis)

    /**
     * Build a WebDAV URL from a path by encoding each segment.
     */
    // eslint-disable-next-line sonarjs/no-performance-issue
    function webdavUrl(path: string): string {
      const encodedPath = path
        .split('/')
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join('/')
      return generateUrl('/remote.php/webdav') + '/' + encodedPath
    }

    /**
     * Resolve the file URL using the Nextcloud Viewer props.
     * Priority: fileid > fileInfo.id > source > davPath > path
     */
    function resolveFileUrl(): string | null {
      // Priority 1: Use fileid prop with the app's API endpoint
      if (props.fileid !== null) {
        return generateUrl('/apps/cad_viewer/api/file/{fileId}/content', { fileId: String(props.fileid) })
      }
      const fileIdFromInfo = props.fileInfo?.id
      if (fileIdFromInfo !== undefined) {
        return generateUrl('/apps/cad_viewer/api/file/{fileId}/content', { fileId: String(fileIdFromInfo) })
      }
      // Priority 2: Fallback to source if provided
      if (props.source) {
        return props.source
      }
      // Priority 3: Fallback to davPath with WebDAV
      if (props.davPath) {
        return webdavUrl(props.davPath)
      }
      // Priority 4: Fallback to path with WebDAV
      if (props.path) {
        return webdavUrl(props.path)
      }
      return null
    }

    /**
     * Load the CAD viewer with the given URL.
     * Cancels loading if component has unmounted.
     */
    async function loadViewer(url: string): Promise<void> {
      const container = viewerContainer.value
      if (!container || isUnmounted) return

      try {
        const instance = await loadCADViewer(container, {
          url,
          theme: 'dark',
        })
        // Check if unmounted before assigning (unmount may have occurred during await)
        if (isUnmounted) {
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
      const fileUrl = resolveFileUrl()

      if (!fileUrl) {
        error.value = appTranslation('No file selected. Please open a DWG or DXF file from Nextcloud.')
        loading.value = false
        return
      }

      retryUrl.value = fileUrl

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

      if (!isUnmounted) {
        await loadViewer(fileUrl)
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
      isUnmounted = true
      viewerInstance.value?.dispose()
      viewerInstance.value = null
    })

    async function retryLoad(): Promise<void> {
      if (!retryUrl.value) return

      error.value = null
      loading.value = true

      if (viewerContainer.value) {
        viewerInstance.value?.dispose()
        await loadViewer(retryUrl.value)
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
        if (retryUrl.value) {
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
 * This is the PRIMARY mechanism that enables inline file viewing:
 * when a user clicks a CAD file in Files, the Viewer API automatically
 * opens our handler component inline without navigating away.
 * 
 * Vue 3 Compatibility Note:
 * The Nextcloud Viewer app in Nextcloud 33+ has been migrated to Vue 3.
 * This handler uses a Vue 3 defineComponent with render function to ensure
 * compatibility with the Viewer's Vue 3 runtime.
 */
function registerViewerHandler(): boolean {
  if (isRegistered) return false

  if (OCA?.Viewer !== undefined) {
    OCA.Viewer.registerHandler({
      id: 'cad-viewer',
      group: 'cad',
      mimes: SUPPORTED_MIMES,
      component: CadViewerHandlerComponent,
    })
    isRegistered = true
    return true
  }
  return false
}

// Set up polling to ensure registration happens when OCA.Viewer becomes available
function setupViewerPolling(): void {
  if (registerViewerHandler()) return

  // Poll every 100ms for up to 10 seconds
  let pollCount = 0
  const maxPolls = 100

  const pollInterval = setInterval(() => {
    if (registerViewerHandler()) {
      clearInterval(pollInterval)
      return
    }

    pollCount++
    if (pollCount >= maxPolls) {
      clearInterval(pollInterval)
      console.debug('OCA.Viewer not available after 10 seconds')
    }
  }, 100)
}

// Initialize viewer registration when script loads
setupViewerPolling()

/**
 * Open the CAD viewer inline for a file using the Nextcloud Viewer API.
 * Falls back to standalone page if Viewer API is not available.
 */
function openInViewer(fileId: number | string): void {
  // Priority 1: Open inline via Nextcloud Viewer API
  // OCA.Viewer.open() opens the file in the registered handler inline
  if (OCA?.Viewer?.open !== undefined) {
    OCA.Viewer.open({ fileId })
    return
  }

  // Priority 2: Fallback to standalone viewer page
  // This preserves backward compatibility with the standalone view
  if (OC !== undefined) {
    window.location.href = OC.generateUrl('/apps/cad_viewer/view') + '?fileIds=' + fileId
  }
}

/**
 * Register file actions that appear in the Files "..." context menu.
 * These are secondary actions - the primary inline viewing is handled
 * automatically by OCA.Viewer.registerHandler().
 */
function registerFileActions(): void {
  if (OC === undefined) {
    return
  }

  // Register using the NC33+ @nextcloud/files API
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
      // HIDDEN means this action only appears in the "..." context menu,
      // not as the default click handler. The default click is handled
      // by Nextcloud Viewer via OCA.Viewer.registerHandler().
      default: DefaultType.HIDDEN,
    }
    registerFileAction(action)
  } catch {
    // Fall back
  }
}

// Register file actions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  registerFileActions()
  registerViewerHandler()

  const mountEl =
    document.getElementById('cad-viewer-app') ??
    document.getElementById('cad-viewer-container')

  if (mountEl) {
    app.mount(mountEl)
  }
})

// Also re-register on Nextcloud Files ready event
document.addEventListener('nextcloud-files-ready', () => {
  registerFileActions()
  registerViewerHandler()
})

export default app