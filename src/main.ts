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
    fileInfo?: {
      id: number | string
      path?: string
      mime?: string
      filename?: string
    }
    downloadCallback?: (fileInfo: unknown) => Promise<void>
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

// Retry registration with exponential backoff to ensure OCA.Viewer is available
function registerViewerHandlerWithRetry(maxRetries = 5, baseDelay = 100): void {
  const nextcloudGlobal = globalThis as unknown as { OCA?: NextcloudOCA }
  
  if (nextcloudGlobal.OCA?.Viewer !== undefined) {
    nextcloudGlobal.OCA.Viewer.registerHandler({
      id: 'cad-viewer',
      group: 'cad',
      mimes: SUPPORTED_MIMES,
      component: CadViewerHandler,
    })
    console.log('CAD Viewer handler registered successfully')
    return
  }

  let retries = 0
  const tryRegister = () => {
    if (nextcloudGlobal.OCA?.Viewer !== undefined) {
      nextcloudGlobal.OCA.Viewer.registerHandler({
        id: 'cad-viewer',
        group: 'cad',
        mimes: SUPPORTED_MIMES,
        component: CadViewerHandler,
      })
      console.log('CAD Viewer handler registered successfully')
      return true
    }
    return false
  }

  const attemptRegistration = () => {
    if (tryRegister()) return
    
    retries++
    if (retries <= maxRetries) {
      const delay = baseDelay * Math.pow(2, retries - 1)
      setTimeout(attemptRegistration, delay)
    } else {
      console.warn('OCA.Viewer not available after max retries, CAD viewer handler not registered')
    }
  }

  attemptRegistration()
}

// Also use MutationObserver to detect when OCA.Viewer becomes available
function setupViewerObserver(): void {
  const nextcloudGlobal = globalThis as unknown as { OCA?: NextcloudOCA }
  
  if (nextcloudGlobal.OCA?.Viewer !== undefined) {
    registerViewerHandlerWithRetry()
    return
  }

  // Poll for OCA.Viewer availability
  let pollCount = 0
  const pollInterval = setInterval(() => {
    if (nextcloudGlobal.OCA?.Viewer !== undefined) {
      clearInterval(pollInterval)
      registerViewerHandlerWithRetry()
    } else if (pollCount > 50) { // Stop after ~5 seconds
      clearInterval(pollInterval)
      console.warn('OCA.Viewer not available, CAD viewer handler not registered')
    }
    pollCount++
  }, 100)
}

// Initialize viewer registration when DOM is ready
function initViewerRegistration(): void {
  setupViewerObserver()
}

// Use DOMContentLoaded as a fallback trigger
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initViewerRegistration)
} else {
  initViewerRegistration()
}

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

  const mountEl =
    document.getElementById('cad-viewer-app') ??
    document.getElementById('cad-viewer-container')

  if (mountEl) {
    app.mount(mountEl)
  }
})

export default app
