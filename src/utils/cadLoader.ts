import type { App } from 'vue'

export interface CADViewerOptions {
  locale?: string
  url?: string
  localFile?: File
  theme?: 'light' | 'dark'
  baseUrl?: string
  background?: number
  useMainThreadDraw?: boolean
}

export interface ViewerInstance {
  container: HTMLElement
  initialized: boolean
  app: App | null
  loadFile(fileUrl: string): Promise<{ success: boolean; error?: string }>
  dispose(): void
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
  } = options

  const viewerProps: Record<string, unknown> = {
    locale,
    theme,
    background,
    useMainThreadDraw,
  }

  if (url !== undefined) viewerProps.url = url
  if (localFile !== undefined) viewerProps.localFile = localFile
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
