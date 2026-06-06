import { createApp } from 'vue'
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

// Declare global types for Nextcloud Viewer
interface NextcloudViewer {
  registerHandler: (handler: {
    id: string
    group?: string
    mimes: string[]
    component: unknown
  }) => void
}

interface NextcloudOCA {
  Viewer?: NextcloudViewer
  Files?: {
    registerFileAction: (action: {
      name: string
      displayName: string
      mime: string
      permissions: number
      icon: () => string
      actionHandler: (fileName: string, context: { fileInfo?: { id: number | string; path?: string } }) => void
    }) => void
  }
}

// Track if we've already registered to avoid duplicate registrations
let isRegistered = false

// Register the CAD viewer handler with Nextcloud Viewer
function registerViewerHandler(): boolean {
  if (isRegistered) return false
  
  const nextcloudGlobal = globalThis as unknown as { OCA?: NextcloudOCA }
  
  if (nextcloudGlobal.OCA?.Viewer !== undefined) {
    nextcloudGlobal.OCA.Viewer.registerHandler({
      id: 'cad-viewer',
      group: 'cad',
      mimes: SUPPORTED_MIMES,
      component: CadViewerHandler,
    })
    isRegistered = true
    console.log('CAD Viewer handler registered successfully')
    return true
  }
  return false
}

// Set up polling to ensure registration happens when OCA.Viewer becomes available
function setupViewerPolling(): void {
  // If already registered, nothing to do
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
      console.warn('OCA.Viewer not available after 10 seconds, CAD viewer handler not registered')
    }
  }, 100)
}

// Also use MutationObserver to detect when OCA.Viewer becomes available
function setupViewerObserver(): void {
  if (isRegistered) return

  // Try immediately first
  if (registerViewerHandler()) return

  // Set up MutationObserver to watch for OCA object changes
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      if (registerViewerHandler()) {
        observer.disconnect()
      }
    })
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
  }
  
  // Also set up polling as backup
  setupViewerPolling()
}

// Initialize viewer registration immediately when script loads
setupViewerObserver()

function registerFileAction(): void {
  if (typeof OC === 'undefined' || typeof OCA === 'undefined') {
    return
  }

  SUPPORTED_MIMES.forEach((mime) => {
    if (OCA.Files && typeof OCA.Files.registerFileAction === 'function') {
      OCA.Files.registerFileAction({
        name: 'cad-viewer-open',
        displayName: t('cad_viewer', 'Open with CAD Viewer'),
        mime,
        permissions: OC.PERMISSION_READ,
        icon: () => OC.imagePath('core', 'actions/screen'),
        actionHandler: (_fileName: string, context: { fileInfo?: { id: number | string } }) => {
          const fileId = context.fileInfo?.id
          if (fileId) {
            window.location.href = OC.generateUrl('/apps/cad_viewer/view') + '?fileIds=' + fileId
          }
        },
      })
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  // Register file action for sidebar menu (needs DOM to be ready)
  registerFileAction()

  // Try registration again at DOMContentLoaded in case it wasn't available earlier
  registerViewerHandler()

  const mountEl =
    document.getElementById('cad-viewer-app') ??
    document.getElementById('cad-viewer-container')

  if (mountEl) {
    app.mount(mountEl)
  }
})

export default app
