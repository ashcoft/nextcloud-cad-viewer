import { createApp } from 'vue'
import CadViewerApp from './App.vue'
import router from './router'
import CadViewerHandler from './components/ViewerHandler.vue'

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
    downloadCallback?: (fileInfo: unknown) => Promise<void>
  }) => void
}

interface NextcloudOCA {
  Viewer?: NextcloudViewer
}

// Register the viewer handler when DOM is ready to ensure OCA.Viewer is available
function registerViewerHandler(): void {
  const nextcloudGlobal = globalThis as unknown as { OCA?: NextcloudOCA }
  
  // Try to register immediately first in case OCA.Viewer is already available
  if (nextcloudGlobal.OCA?.Viewer) {
    nextcloudGlobal.OCA.Viewer.registerHandler({
      id: 'cad-viewer',
      group: 'cad',
      mimes: SUPPORTED_MIMES,
      component: CadViewerHandler,
    })
    console.log('CAD viewer handler registered successfully')
  } else {
    console.warn('OCA.Viewer not available yet, will retry on DOMContentLoaded')
  }
}

// Register immediately if possible, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    registerViewerHandler()
  })
} else {
  // DOM already loaded, try immediately
  registerViewerHandler()
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
