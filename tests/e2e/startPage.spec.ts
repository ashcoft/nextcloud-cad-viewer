import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * The blank drawing form is a native <dialog> that must stay hidden until the
 * user clicks "New blank drawing".
 *
 * Nextcloud's core reset styles `dialog { display: block }`, which outranks the
 * browser's own `dialog:not([open]) { display: none }`. The dialog therefore
 * rendered inline on page load, before any click — the bug this test guards
 * against.
 *
 * The component's scoped rules are read from the SFC rather than restated, so a
 * copy cannot drift and the regression cannot pass unnoticed. `scoped` adds a
 * data-v attribute; injecting the rules verbatim is equivalent for these
 * selectors because the fixture uses the same class names and the specificity
 * comparison against the reset is what matters here.
 */
function startPageScopedStyles(): string {
  const startPage = readFileSync(resolve(__dirname, '../../src/StartPage.vue'), 'utf8')
  const match = startPage.match(/<style scoped>([\s\S]*?)<\/style>/)
  if (!match) {
    throw new Error('StartPage.vue has no <style scoped> block')
  }

  return match[1]
}

/**
 * The reset rule from Nextcloud's core stylesheet that makes the bug possible
 * (core/css/styles.scss). Reproduced here because Nextcloud core CSS is not
 * part of this repository and is not loaded in the test.
 */
const NEXTCLOUD_DIALOG_RESET = 'article, aside, dialog, figure, footer, header, hgroup, nav, section { display: block; }'

function fixture(): string {
  return `<!doctype html><html><head>
    <style>${NEXTCLOUD_DIALOG_RESET}</style>
    <style>${startPageScopedStyles()}</style>
  </head>
  <body style="margin:0">
    <div class="cad-start">
      <dialog class="cad-start__dialog" id="dialog">
        <form><input id="name" type="text"></form>
      </dialog>
    </div>
  </body></html>`
}

test('the blank drawing dialog is hidden until it is opened', async ({ page }) => {
  await page.setContent(fixture())

  const dialog = page.locator('#dialog')

  // The regression: without the component's `:not([open])` rule, Nextcloud's
  // reset leaves the dialog rendered and visible on load.
  await expect(dialog).toBeHidden()

  await page.evaluate(() => (document.getElementById('dialog') as HTMLDialogElement).showModal())
  await expect(dialog).toBeVisible()

  await page.evaluate(() => (document.getElementById('dialog') as HTMLDialogElement).close())
  await expect(dialog).toBeHidden()
})
