import { createApp } from 'vue'
import { registerFileAction, DefaultType } from '@nextcloud/files'
import type { IFileAction } from '@nextcloud/files'
import CadViewerApp from './App.vue'
import router from './router'
import CadViewerHandler from './components/ViewerHandler.vue'

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
 * Register the CAD viewer handler with the Nextcloud Viewer API.
 * This is the PRIMARY mechanism that enables inline file viewing:
 * when a user clicks a CAD file in Files, the Viewer API automatically
 * opens our handler component inline without navigating away.
 */
function registerViewerHandler(): boolean {
  if (isRegistered) return false

  if (OCA?.Viewer !== undefined) {
    OCA.Viewer.registerHandler({
      id: 'cad-viewer',
      group: 'cad',
      mimes: SUPPORTED_MIMES,
      component: CadViewerHandler,
    })
    isRegistered = true
    console.debug('CAD Viewer handler registered successfully')
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