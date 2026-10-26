import { registerFileAction } from '@nextcloud/files'
import { translate as t } from '@nextcloud/l10n'
import { createCadFileAction } from './fileActions'
import { mountCadStartPage, mountCadViewerApp } from './mount'

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

function showMountError(container: HTMLElement): void {
  // Leave a visible message instead of a blank page with a silent rejection.
  container.textContent = t(
    'cad_viewer',
    'Failed to load the CAD Viewer. Please reload the page and try again.',
  )
}

/**
 * Mount the app component that matches the rendered template.
 *
 * The start page renders `#cad-viewer-start`, the viewer renders
 * `#cad-viewer-container`. On the Files app neither exists and this is a
 * no-op.
 */
function mountStandaloneApp(): void {
  const startContainer = document.getElementById('cad-viewer-start')
  if (startContainer) {
    mountCadStartPage(startContainer).catch((error: unknown) => {
      console.error('CAD Viewer: failed to mount the start page', error)
      showMountError(startContainer)
    })
    return
  }

  const viewerContainer =
    document.getElementById('cad-viewer-app') ??
    document.getElementById('cad-viewer-container')

  if (!viewerContainer) {
    return
  }

  mountCadViewerApp(viewerContainer).catch((error: unknown) => {
    console.error('CAD Viewer: failed to mount the viewer', error)
    showMountError(viewerContainer)
  })
}

function init(): void {
  registerCadFileAction()
  mountStandaloneApp()
}

init()

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountStandaloneApp, { once: true })
}

