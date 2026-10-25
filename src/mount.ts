import type { App } from 'vue'

let app: App | null = null
let mounting = false

/**
 * Mount the full-page CAD viewer into a container element.
 *
 * Vue and the viewer component are imported lazily so this module (which is
 * loaded as an init script on every Files page) stays small; the viewer
 * bundle is only fetched when the app's own page actually renders a
 * container.
 *
 * The file id is read from the container's `data-file-ids` attribute (set by
 * the PHP template) or from the `fileIds`/`fileId` query parameter.
 */
export async function mountCadViewerApp(container: HTMLElement): Promise<void> {
  if (app !== null || mounting) {
    return
  }
  mounting = true

  try {
    const [{ createApp }, { default: CadViewerApp }] = await Promise.all([
      import('vue'),
      import('./App.vue'),
    ])

    const fileId =
      container.dataset.fileIds ||
      new URLSearchParams(window.location.search).get('fileIds') ||
      new URLSearchParams(window.location.search).get('fileId') ||
      null

    app = createApp(CadViewerApp, { fileId })
    app.mount(container)
  } finally {
    mounting = false
  }
}
