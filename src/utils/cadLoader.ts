import type { App } from 'vue'

export interface CADViewerOptions {
  locale?: string
  url?: string
  localFile?: File
  theme?: 'light' | 'dark'
  baseUrl?: string
  background?: number
  useMainThreadDraw?: boolean
  /** Base64 encoded file content from load endpoint */
  fileContent?: string
  /** Original filename */
  fileName?: string
}

export interface ViewerInstance {
  container: HTMLElement
  initialized: boolean
  app: App | null
  loadFile(fileUrl: string): Promise<{ success: boolean; error?: string }>
  dispose(): void
}

/**
 * Convert base64 encoded string to a File object.
 * MlCadViewer only accepts url or localFile props, not raw base64 content.
 */
function base64ToFile(base64: string, fileName: string): File {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  // Determine MIME type from extension
  const ext = fileName.split('.').pop()?.toLowerCase()
  const mimeType = ext === 'dxf' ? 'application/dxf' : 'application/dwg'
  return new File([bytes], fileName, { type: mimeType })
}

export async function loadCADViewer(
  container: HTMLElement,
  options: CADViewerOptions = {},
): Promise<ViewerInstance> {
  // Dynamically import heavy dependencies to enable lazy loading
  // Webpack will create a separate chunk for these modules
  const [vueModule, elementPlus, cadViewerModule] = await Promise.all([
    import(/* webpackChunkName: "cad-viewer-vue" */ 'vue'),
    import(/* webpackChunkName: "cad-viewer-element" */ 'element-plus'),
    import(/* webpackChunkName: "cad-viewer-engine" */ '@mlightcad/cad-viewer'),
  ])

  const { createApp } = vueModule
  const ElementPlus = elementPlus.default
  const { i18n, MlCadViewer } = cadViewerModule

  const {
    locale = 'en',
    url,
    localFile,
    theme = 'dark',
    baseUrl,
    background = 0x1e1e1e,
    useMainThreadDraw = false,
    fileContent,
    fileName,
  } = options

  const viewerProps: Record<string, unknown> = {
    locale,
    theme,
    background,
    useMainThreadDraw,
  }

  if (url !== undefined) viewerProps.url = url

  // Handle localFile - either provided directly or converted from base64
  if (localFile !== undefined) {
    viewerProps.localFile = localFile
  } else if (fileContent !== undefined && fileName !== undefined) {
    // MlCadViewer only accepts localFile (File object), not raw content
    viewerProps.localFile = base64ToFile(fileContent, fileName)
  }

  if (baseUrl !== undefined) viewerProps.baseUrl = baseUrl

  function mountApp(props: Record<string, unknown>): App {
    const vueApp = createApp(MlCadViewer, props)
    vueApp.use(i18n)
    vueApp.use(ElementPlus)
    vueApp.mount(container)
    return vueApp
  }

  const initialApp = mountApp(viewerProps)

  const instance: ViewerInstance = {
    container,
    initialized: true,
    app: initialApp,

    async loadFile(fileUrl: string): Promise<{ success: boolean; error?: string }> {
      try {
        this.dispose()
        this.app = mountApp({ ...viewerProps, url: fileUrl })
        this.initialized = true
        return { success: true }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        return { success: false, error: message }
      }
    },

    dispose(): void {
      if (this.app) {
        this.app.unmount()
        this.app = null
      }
      this.initialized = false
    },
  }

  return instance
}

export function isSupportedCADFormat(mimeType: string): boolean {
  return [
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
  ].includes(mimeType)
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? (parts.pop() as string).toLowerCase() : ''
}
