/// <reference types="jest" />
/**
 * The settings form is plain DOM code (no framework), so it is exercised
 * against a real document: render the markup the PHP template produces, wire
 * the form, click Save, and assert on what was posted.
 */
import axios from '@nextcloud/axios'
import { initSettingsForm } from './adminSettings'

const template = `
  <div id="cad-viewer" class="section section-cad-viewer">
    <select id="cad-viewer-theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
    <select id="cad-viewer-previews">
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
    <button type="button" id="cad-viewer-save">Save</button>
    <span id="cad-viewer-status" role="status"></span>
  </div>
`

function setup(theme = 'light', previews = 'yes'): HTMLButtonElement {
  document.body.innerHTML = template
  ;(document.getElementById('cad-viewer-theme') as HTMLSelectElement).value = theme
  ;(document.getElementById('cad-viewer-previews') as HTMLSelectElement).value = previews
  initSettingsForm()
  return document.getElementById('cad-viewer-save') as HTMLButtonElement
}

const status = () => document.getElementById('cad-viewer-status')?.textContent
/** Let the click handler's promise chain settle. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('admin settings form', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('posts every field from the form', async () => {
    setup('dark', 'no').click()
    await flush()

    expect(axios.post).toHaveBeenCalledTimes(1)
    const [url, body] = (axios.post as jest.Mock).mock.calls[0]
    expect(String(url)).toContain('apps/cad_viewer/settings/save')
    expect(body).toBeInstanceOf(URLSearchParams)
    expect((body as URLSearchParams).get('theme')).toBe('dark')
    expect((body as URLSearchParams).get('previews')).toBe('no')
  })

  it('reports success in the status region', async () => {
    setup().click()
    await flush()

    expect(status()).toBe('Settings have been successfully saved')
  })

  it('reports a failure instead of throwing', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(axios.post as jest.Mock).mockRejectedValueOnce(new Error('network down'))

    setup().click()
    await flush()

    expect(status()).toBe('Error when trying to save settings')
    // The failure is logged for debugging, but must not leak into the status.
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it('disables the button while the request is in flight', async () => {
    let release: (() => void) | undefined
    ;(axios.post as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => {
        release = () => resolve(undefined)
      }),
    )

    const button = setup()
    button.click()
    await flush()
    expect(button.disabled).toBe(true)

    release?.()
    await flush()
    expect(button.disabled).toBe(false)
  })

  it('re-enables the button after a failure', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(axios.post as jest.Mock).mockRejectedValueOnce(new Error('network down'))

    const button = setup()
    button.click()
    await flush()

    // Assert the request actually ran, otherwise a handler that never fired
    // would leave the button enabled and still pass.
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(status()).toBe('Error when trying to save settings')
    expect(button.disabled).toBe(false)
    consoleError.mockRestore()
  })

  it('does nothing when the form is absent', () => {
    document.body.innerHTML = ''
    initSettingsForm()

    expect(axios.post).not.toHaveBeenCalled()
  })
})
