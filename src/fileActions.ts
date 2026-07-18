import { DefaultType, type IFileAction } from '@nextcloud/files'

type TranslateFn = (app: string, text: string) => string
type OpenCadFileFn = (fileId: number | string) => void

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
      const fileId = nodes[0]?.id
      if (fileId !== undefined) {
        openFile(fileId)
      }
      return null
    },
    default: DefaultType.DEFAULT,
  }
}
