import { registerFileAction } from '@nextcloud/files'
import { translate as t } from '@nextcloud/l10n'
import { createCadFileAction } from './fileActions'
import { mountCadViewerApp } from './mount'

/**
 * Register the "Open with CAD Viewer" file action.
 *
 * A single registration guarded by a module flag: the script is an init
 * script, so this module is evaluated exactly once per page. Re-running it
 * on Files events would throw "FileAction cad-viewer-open already registered".
 */
function registerCadFileAction(): void {
  try {
    registerFileAction(createCadFileAction({ translate: t }))
  } catch {
    // The action is already registered; nothing else to do.
  }
}

/**
 * Mount the full-page CAD viewer when the app's own route rendered a
 * container. On the Files app no container exists and this is a no-op.
 */
function mountStandaloneViewer(): void {
  const container =
    document.getElementById('cad-viewer-app') ??
    document.getElementById('cad-viewer-container')

  if (!container) {
    return
  }

  mountCadViewerApp(container).catch((error: unknown) => {
    // Leave a visible message instead of a blank page with a silent rejection.
    console.error('CAD Viewer: failed to mount the viewer', error)
    container.textContent = t(
      'cad_viewer',
      'Failed to load the CAD Viewer. Please reload the page and try again.',
    )
  })
}

function init(): void {
  registerCadFileAction()
  mountStandaloneViewer()
}

init()

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountStandaloneViewer, { once: true })
}
