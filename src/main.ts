import { createApp } from 'vue'
import { registerFileAction } from '@nextcloud/files'
import { registerHandler } from '@nextcloud/viewer'
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

interface NextcloudOCA {
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

declare const OC: NextcloudOC
declare const OCA: NextcloudOCA

/**
 * Open the CAD viewer for a file
 */
function openInViewer(fileId: number | string): void {
  if (OC !== undefined) {
    window.location.href = OC.generateUrl('/apps/cad_viewer/view') + '?fileIds=' + fileId
  }
}

/**
 * Register the CAD viewer handler with Nextcloud Viewer using the new API
 * This registers the handler to open CAD files in the viewer instead of downloading
 */
registerHandler({
  id: 'cad-viewer',
  group: 'cad',
  mimes: SUPPORTED_MIMES,
  component: CadViewerHandler,
})
console.log('CAD Viewer handler registered successfully')

/**
 * Register file actions for CAD files in the Files sidebar
 * Uses the Nextcloud Files app API (OCA.Files.registerFileAction)
 * Also registers using @nextcloud/files package API for NC33+ compatibility
 */
function registerFileActions(): void {
  if (OC === undefined || OCA === undefined) {
    return
  }

  // Register a file action for each supported MIME type
  SUPPORTED_MIMES.forEach((mime) => {
    // NC33+ package API
    try {
      const action: IFileAction = {
        id: 'cad-viewer-open',
        displayName: () => t('cad_viewer', 'Open with CAD Viewer'),
        iconSvgInline: () => CAD_VIEWER_ICON,
        enabled: ({ nodes }) => nodes.some((node) => node.mime === mime),
        exec: async ({ nodes }) => {
          const fileId = nodes[0].id
          if (fileId !== undefined) {
            openInViewer(fileId)
          }
          return null
        },
      }
      registerFileAction(action)
    } catch {
      // Fall back to OCA global if package API fails
    }

    // Legacy OCA global fallback
    if (OCA?.Files?.registerFileAction !== undefined) {
      OCA.Files.registerFileAction({
        name: 'cad-viewer-open',
        displayName: t('cad_viewer', 'Open with CAD Viewer'),
        mime,
        permissions: OC.PERMISSION_READ,
        icon: () => CAD_VIEWER_ICON,
        actionHandler: (_fileName: string, context: { fileInfo?: { id: number | string } }) => {
          const fileId = context.fileInfo?.id
          if (fileId) {
            openInViewer(fileId)
          }
        },
      })
    }
  })
}

// Register file actions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Register file action for sidebar menu
  registerFileActions()

  const mountEl =
    document.getElementById('cad-viewer-app') ??
    document.getElementById('cad-viewer-container')

  if (mountEl) {
    app.mount(mountEl)
  }
})

export default app
