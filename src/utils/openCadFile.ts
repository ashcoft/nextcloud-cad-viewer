import type { CadFileTarget } from '../fileActions'

export interface ViewerApi {
  open: (options: { path?: string }) => unknown
}

/**
 * Open a CAD file through the Nextcloud Viewer.
 *
 * The Viewer resolves files from a DAV path, so `open({ path })` is required.
 * Opening with a file id alone makes the Viewer throw
 * "Viewer needs either an URL or path to open. None given".
 *
 * @returns true when the Viewer handled the request, false when the caller
 *   should fall back to the standalone app route.
 */
export function openCadFile(target: CadFileTarget, viewer: ViewerApi | undefined): boolean {
  if (viewer?.open) {
    viewer.open({ path: target.path })
    return true
  }

  return false
}
