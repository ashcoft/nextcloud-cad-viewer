import { DefaultType, type IFileAction } from '@nextcloud/files'

type TranslateFn = (app: string, text: string) => string

export interface CadFileTarget {
  /** Nextcloud file id, used as a fallback when the Viewer API is unavailable */
  id?: number | string
  /** Path relative to the user root, as required by OCA.Viewer.open() */
  path: string
}

type OpenCadFileFn = (target: CadFileTarget) => void

export const SUPPORTED_MIMES = [
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

export function isSupportedCadMime(mime: string): boolean {
  return SUPPORTED_MIMES.includes(mime)
}

export function createCadFileAction({
  translate,
  openFile,
  iconSvgInline,
}: {
  translate: TranslateFn
  openFile: OpenCadFileFn
  iconSvgInline: string
}): IFileAction {
  return {
    id: 'cad-viewer-open',
    displayName: () => translate('cad_viewer', 'Open with CAD Viewer'),
    iconSvgInline: () => iconSvgInline,
    enabled: ({ nodes }) => nodes.length === 1 && nodes.some((node) => isSupportedCadMime(node.mime)),
    exec: async ({ nodes }) => {
      const node = nodes[0]
      if (node?.path) {
        // The Nextcloud Viewer resolves and fetches files from a DAV path,
        // so pass the path rather than the file id.
        openFile({ id: node.id, path: node.path })
      }
      return null
    },
    default: DefaultType.DEFAULT,
  }
}
