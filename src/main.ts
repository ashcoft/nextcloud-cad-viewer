import { createApp } from 'vue'
import { registerFileAction } from '@nextcloud/files'
import type { IFileAction } from '@nextcloud/files'
import CadViewerApp from './App.vue'
import CadViewerHandler from './components/ViewerHandler.vue'

// Nextcloud translation function
const t = (app: string, text: string): string => {
  const translate = (globalThis as { t?: (app: string, text: string) => string }).t
  return translate ? translate(app, text) : text
}

// Create Vue app instance
const app = createApp(CadViewerApp)

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
  <path d="M7 2a2 2 0 0 0-2 2v1H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2V4a2 2 0 0 0-2-2H7zm0 2h10v2H7V4zm0 4h10v2H7V8zm0 4h6v2H7v-2z"/>
</svg>`

// Global Nextcloud types
interface NextcloudOC {
  PERMISSION_READ: number
  generateUrl: (url: string, params?: Record<string, unknown>) => string
  imagePath: (app: string, file: string) => string
}

interface NextcloudOCA {
  Viewer?: {
    registerHandler: (handler: {
      id: string
      group?: string
      mimes: string[]
      component: unknown
    }) => void
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
  }
}

declare const OC: NextcloudOC
declare const OCA: NextcloudOCA

// Track registration state
let isViewerHandlerRegistered = false
let isFileActionsRegistered = false

/**
 * Register the CAD viewer handler with Nextcloud Viewer
 */
function registerViewerHandler(): boolean {
  if (isViewerHandlerRegistered || OCA?.Viewer === undefined) {
    return isViewerHandlerRegistered
  }

  OCA.Viewer.registerHandler({
    id: 'cad-viewer',
    group: 'cad',
    mimes: SUPPORTED_MIMES,
    component: CadViewerHandler,
  })
  isViewerHandlerRegistered = true
  console.log('CAD Viewer handler registered successfully')
  return true
}

/**
 * Open the CAD viewer for a file
 */
function openInViewer(fileId: number | string): void {
  if (OC !== undefined) {
    window.location.href = OC.generateUrl('/apps/cad_viewer/view') + '?fileIds=' + fileId
  }
}

/**
 * Register file actions for CAD files in the Files sidebar
 */
function registerFileActions(): void {
  if (isFileActionsRegistered || OC === undefined || OCA === undefined) {
    return
  }

  // Register using @nextcloud/files package API for NC33+ compatibility
  try {
    const action: IFileAction = {
      id: 'cad-viewer-open',
      displayName: () => t('cad_viewer', 'Open with CAD Viewer'),
      iconSvgInline: () => CAD_VIEWER_ICON,
      enabled: ({ nodes }) => nodes.some((node) => SUPPORTED_MIMES.includes(node.mime)),
      exec: async ({ nodes }) => {
        const fileId = nodes[0].id
        if (fileId !== undefined) {
          openInViewer(fileId)
        }
        return null
      },
    }
    registerFileAction(action)
    isFileActionsRegistered = true
  } catch {
    // Fall back to legacy OCA global
    registerLegacyFileActions()
  }
}

/**
 * Legacy file action registration using OCA global
 */
function registerLegacyFileActions(): void {
  if (OCA?.Files?.registerFileAction === undefined) {
    return
  }

  SUPPORTED_MIMES.forEach((mime) => {
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
  })
  isFileActionsRegistered = true
}

/**
 * Initialize CAD viewer when DOM is ready
 */
function initializeViewer(): void {
  // Register file actions
  registerFileActions()

  // Try viewer handler registration
  registerViewerHandler()

  // Mount Vue app if container exists
  const mountEl =
    document.getElementById('cad-viewer-app') ??
    document.getElementById('cad-viewer-container')

  if (mountEl) {
    app.mount(mountEl)
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeViewer)
} else {
  initializeViewer()
}

export default app
