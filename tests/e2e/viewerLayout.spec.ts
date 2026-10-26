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
 * inside the container fills the app content area, not the viewport.
 */
const css = readFileSync(resolve(__dirname, '../../css/cad-viewer.css'), 'utf8')

const HEADER = 50
const CONTENT = 600

function fixture(): string {
  return `<!doctype html><html><head><style>${css}</style></head>
    <body style="margin:0">
      <header id="header" style="position:fixed;top:0;left:0;right:0;height:${HEADER}px"></header>
      <div id="content" style="margin-top:${HEADER}px;height:${CONTENT}px;position:relative">
        <div id="cad-viewer-container">
          <div id="fixed-child" style="position:fixed;inset:0"></div>
        </div>
      </div>
    </body></html>`
}

test('the viewer container is a containing block for fixed descendants', async ({ page }) => {
  await page.setContent(fixture())

  const child = await page.locator('#fixed-child').boundingBox()
  const content = await page.locator('#content').boundingBox()

  expect(child).not.toBeNull()
  expect(content).not.toBeNull()
  // The fixed child must fill the content area (below the header), not the
  // viewport: same top and height as #content.
  expect(child!.y).toBeCloseTo(content!.y, 0)
  expect(child!.height).toBeCloseTo(CONTENT, 0)
  // And it must not start at the top of the viewport (over the header).
  expect(child!.y).toBeGreaterThanOrEqual(HEADER)
})
