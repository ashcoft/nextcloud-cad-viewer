import type { CadFileTarget } from '../fileActions'

export interface ViewerApi {
  open: (options: { path?: string }) => unknown
}

export interface OcApi {
  generateUrl: (path: string, params?: Record<string, string | number>) => string
}

/**
 * Open a CAD file through the Nextcloud Viewer.
 *
 * The Viewer resolves files from a DAV path, so `open({ path })` is required.
 * Passing a file id alone makes the Viewer throw
 * "Viewer needs either an URL or path to open. None given".
 *
 * Returns a fallback URL to navigate to when the Viewer API is unavailable,
 * or null when the Viewer handled the request.
 */
export function openCadFile(
  target: CadFileTarget,
  viewer: ViewerApi | undefined,
  oc: OcApi | undefined,
): string | null {
  if (viewer?.open) {
    viewer.open({ path: target.path })
    return null
  }

  if (oc && target.id !== undefined) {
    return oc.generateUrl('/apps/cad_viewer/view') + '?fileIds=' + target.id
  }

  return null
}
