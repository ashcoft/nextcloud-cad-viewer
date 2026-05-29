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
declare global {
  interface GlobalThis {
    OCA?: {
      Viewer?: {
        registerHandler: (handler: {
          id: string
          group?: string
          mimes: string[]
          component: unknown
          downloadCallback?: (fileInfo: unknown) => Promise<void>
        }) => void
      }
    }
  }
}

function registerViewerHandler(): void {
  if (globalThis.OCA?.Viewer === undefined) {
    console.warn('OCA.Viewer not available, CAD viewer handler not registered')
    return
  }

  globalThis.OCA.Viewer.registerHandler({
    id: 'cad-viewer',
    group: 'cad',
    mimes: SUPPORTED_MIMES,
    component: CadViewerHandler,
  })
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
  // Register as a Nextcloud Viewer handler for DWG/DXF files
  registerViewerHandler()

  // Also register file action for sidebar menu
  registerFileAction()

  const mountEl =
    document.getElementById('cad-viewer-app') ??
    document.getElementById('cad-viewer-container')

  if (mountEl) {
    app.mount(mountEl)
  }
})

export default app
