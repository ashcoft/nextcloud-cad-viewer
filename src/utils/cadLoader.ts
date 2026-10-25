import type { App } from 'vue'
import { generateUrl } from '@nextcloud/router'
import { isSupportedCadMime } from './mimeTypes'

export interface CADViewerOptions {
  locale?: string
  /** Direct URL to the CAD file */
  url?: string
  /**
   * Optional local File object to automatically load a CAD file on component mount.
   */
  localFile?: File
  theme?: 'light' | 'dark'
  baseUrl?: string
  background?: number
  useMainThreadDraw?: boolean
  /** Original filename (used with url prop for logging/debugging) */
  fileName?: string
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
  const [vueModule, elementPlus, cadViewerModule, dataModel, libredwgModule] = await Promise.all([
    import(/* webpackChunkName: "cad-viewer-vue" */ 'vue'),
    import(/* webpackChunkName: "cad-viewer-element" */ 'element-plus'),
    import(/* webpackChunkName: "cad-viewer-engine" */ '@mlightcad/cad-viewer'),
    import(/* webpackChunkName: "cad-viewer-engine" */ '@mlightcad/data-model'),
    import(/* webpackChunkName: "cad-viewer-engine" */ '@mlightcad/libredwg-converter'),
  ])

  const { createApp } = vueModule
  const ElementPlus = elementPlus.default
  const { i18n, MlCadViewer } = cadViewerModule

  // The viewer ships no DWG converter; the host app must register one. The
  // LibreDWG converter parses DWG in its own worker, which loads the wasm from
  // next to itself, so point it at the assets deployed with the app.
  const { AcDbDatabaseConverterManager, AcDbFileType } = dataModel
  const { AcDbLibreDwgConverter } = libredwgModule
  const assetsBase = generateUrl('/apps/cad_viewer/assets/')
  AcDbDatabaseConverterManager.instance.register(
    AcDbFileType.DWG,
    new AcDbLibreDwgConverter({
      parserWorkerUrl: `${assetsBase}libredwg-parser-worker.js`,
    }),
  )

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

  // Use URL-based loading if provided, otherwise fall back to localFile
  if (url !== undefined) {
    viewerProps.url = url
  } else if (localFile !== undefined) {
    viewerProps.localFile = localFile
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
  return isSupportedCadMime(mimeType)
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? (parts.pop() as string).toLowerCase() : ''
}
