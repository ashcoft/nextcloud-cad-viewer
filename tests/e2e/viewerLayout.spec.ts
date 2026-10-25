import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * The CAD viewer's root element is `position: fixed; inset: 0`, which would
 * cover the whole viewport — including the Nextcloud header — and make the
 * viewer's menu bar overlap the server menu bar. The app's stylesheet makes
 * #cad-viewer-container a containing block for fixed descendants so the viewer
 * stays inside the app content area.
 *
 * This loads the real stylesheet in a browser and checks that a fixed element
 * inside the container is positioned relative to the container, not the viewport.
 */
const css = readFileSync(resolve(__dirname, '../../css/cad-viewer.css'), 'utf8')

test('the viewer container is a containing block for fixed descendants', async ({ page }) => {
  await page.setContent(`<!doctype html><html><head><style>${css}</style></head>
    <body style="margin:0">
      <header id="header" style="height:50px"></header>
      <div id="content" style="margin-top:50px;height:600px;position:relative">
        <div id="cad-viewer-container">
          <div id="fixed-child" style="position:fixed;inset:0"></div>
        </div>
      </div>
    </body></html>`)

  const box = await page.locator('#fixed-child').boundingBox()

  // The fixed child must start below the header (inside the container), not at
  // the top of the viewport.
  expect(box).not.toBeNull()
  expect(box!.y).toBeGreaterThanOrEqual(50)
})
