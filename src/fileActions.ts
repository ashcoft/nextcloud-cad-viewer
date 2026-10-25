import { generateUrl } from '@nextcloud/router'
import { DefaultType, type IFileAction, type INode } from '@nextcloud/files'
import { isSupportedCadMime, hasCadExtension } from './utils/mimeTypes'

type TranslateFn = (app: string, text: string) => string

/** Inline CAD icon used for the file action. */
export const CAD_VIEWER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M7 2a2 2 0 0 0-2 2v1H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2V4a2 2 0 0 0-2-2H7zm0 2h10v2H7V4zm0 4h10v2H7V8zm0 4h6v2H7v-2z"/>
</svg>`

/**
 * Whether a node is a CAD drawing the app can open.
 *
 * Falls back to the file extension so drawings still open when their MIME
 * type has not been resolved to a CAD type yet (e.g. the Nextcloud MIME
 * mapping was not refreshed after upload).
 */
export function isCadNode(node: Pick<INode, 'mime' | 'basename'>): boolean {
  return isSupportedCadMime(node.mime) || hasCadExtension(node.basename)
}

/**
 * Build the URL of the app's own full-page viewer for a file id.
 */
export function buildViewerUrl(fileId: number | string): string {
  return `${generateUrl('/apps/cad_viewer/view')}?fileIds=${encodeURIComponent(String(fileId))}`
}

/**
 * Create the "Open with CAD Viewer" file action.
 *
 * The action is registered as the default for CAD files, so a single click
 * opens the drawing. It navigates to the app's own viewer route, which runs
 * the Vue 3 CAD viewer directly. This deliberately avoids the Nextcloud
 * Viewer integration: the bundled Viewer is a Vue 2 application and cannot
 * render the Vue 3 CAD component.
 */
export function createCadFileAction({
  translate,
  iconSvgInline = CAD_VIEWER_ICON,
  navigate = (url: string) => {
    window.location.href = url
  },
}: {
  translate: TranslateFn
  iconSvgInline?: string
  navigate?: (url: string) => void
}): IFileAction {
  return {
    id: 'cad-viewer-open',
    displayName: () => translate('cad_viewer', 'Open with CAD Viewer'),
    iconSvgInline: () => iconSvgInline,
    default: DefaultType.DEFAULT,
    enabled: ({ nodes }) => nodes.length === 1 && isCadNode(nodes[0]),
    exec: async ({ nodes }) => {
      const node = nodes[0]
      if (node?.fileid === undefined) {
        return false
      }
      navigate(buildViewerUrl(node.fileid))
      return null
    },
  }
}
