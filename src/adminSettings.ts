import axios from '@nextcloud/axios'
import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'

const APP_ID = 'cad_viewer'

/**
 * Wire the admin settings form: post every field on Save and report the
 * outcome in the status region, so it is announced to screen readers too.
 *
 * Exported so tests can drive it against a rendered form.
 */
export function initSettingsForm(): void {
  const saveButton = document.getElementById('cad-viewer-save')
  const status = document.getElementById('cad-viewer-status')
  if (!(saveButton instanceof HTMLButtonElement) || !(status instanceof HTMLElement)) {
    return
  }

  const fields = ['theme', 'previews']

  saveButton.addEventListener('click', async () => {
    const params = new URLSearchParams()
    for (const name of fields) {
      const select = document.getElementById(`cad-viewer-${name}`)
      if (select instanceof HTMLSelectElement) {
        params.append(name, select.value)
      }
    }

    saveButton.disabled = true
    status.textContent = ''

    try {
      await axios.post(generateUrl(`apps/${APP_ID}/settings/save`), params)
      status.textContent = t(APP_ID, 'Settings have been successfully saved')
    } catch (error) {
      status.textContent = t(APP_ID, 'Error when trying to save settings')
      // Log only the HTTP status: the axios error carries
      // config.headers.requesttoken, so it must never be logged whole.
      const httpStatus = (error as { response?: { status?: number } } | null)?.response?.status
      console.error('CAD Viewer: failed to save settings', httpStatus ?? 'request failed')
    } finally {
      saveButton.disabled = false
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSettingsForm, { once: true })
} else {
  initSettingsForm()
}
