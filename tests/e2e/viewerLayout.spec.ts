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


/**
 * The toolbar rules live in App.vue's scoped block, so the test reads them from
 * the component rather than restating them: a copy would drift and would let the
 * stacking fix regress unnoticed.
 *
 * `scoped` adds a data-v attribute; the rules are injected verbatim here, which
 * is equivalent for these selectors because the fixture uses the same class
 * names and no other element competes for them.
 */
function appScopedStyles(): string {
  const app = readFileSync(resolve(__dirname, '../../src/App.vue'), 'utf8')
  const match = app.match(/<style scoped>([\s\S]*?)<\/style>/)
  if (!match) {
    throw new Error('App.vue has no <style scoped> block')
  }

  return match[1]
}

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

/**
 * The Save/Exit toolbar must be visible and clickable above the viewer canvas.
 *
 * The viewer mounts its own root as `position: fixed; inset: 0; z-index: 2`, and
 * #cad-viewer-container's transform makes that container its containing block,
 * so the viewer used to paint over the toolbar and the buttons could not be
 * clicked (the bug shipped in 1.2.0).
 *
 * Both real stylesheets are loaded: css/cad-viewer.css and App.vue's scoped
 * block. Reading the component's own rules means the stacking fix cannot regress
 * while this test keeps passing.
 */
function toolbarFixture(options: { overlay?: boolean } = {}): string {
  // The overlay only exists while loading or on error, so it is opt-in: with it
  // always present, a canvas-overlap failure and an overlay-occlusion failure
  // would be indistinguishable.
  const overlay = options.overlay ? '<div class="cad-viewer-overlay" id="overlay"></div>' : ''

  return `<!doctype html><html><head>
    <style>${appScopedStyles()}</style>
    <style>${css}
      /* The viewer ships this rule inside its JS bundle, so it is not part of the
         app stylesheet and has to be reproduced for the overlap to occur. It is
         declared after the app stylesheet, as the bundle loads after the page
         CSS, so the same cascade applies. */
      .ml-cad-viewer-container {
        position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 2;
        pointer-events: auto; overflow: hidden;
      }
    </style>
  </head>
    <body style="margin:0">
      <div id="content" style="height:${CONTENT}px">
        <div id="cad-viewer-container">
          <div class="cad-viewer-wrapper">
            <div class="cad-viewer-toolbar" id="toolbar">
              <button id="save">Save</button><button id="exit">Exit</button>
            </div>
            <div class="cad-viewer-canvas">
              <div class="ml-cad-viewer-container" id="viewer"></div>
            </div>
            ${overlay}
          </div>
        </div>
      </div>
    </body></html>`
}

test('the Save/Exit toolbar is not covered by the viewer canvas', async ({ page }) => {
  await page.setContent(toolbarFixture({ overlay: false }))

  const toolbar = await page.locator('#toolbar').boundingBox()
  const viewer = await page.locator('#viewer').boundingBox()

  expect(toolbar).not.toBeNull()
  expect(viewer).not.toBeNull()

  // The viewer must start below the toolbar, not underneath it.
  expect(viewer!.y).toBeGreaterThanOrEqual(toolbar!.y + toolbar!.height)

  // The toolbar must win the hit test at its buttons, and they must be clickable.
  for (const id of ['save', 'exit']) {
    await expect(page.locator(`#${id}`)).toBeVisible()

    const box = await page.locator(`#${id}`).boundingBox()
    const hit = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.id ?? null,
      { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 },
    )
    expect(hit).toBe(id)
    await page.locator(`#${id}`).click({ timeout: 2000 })
  }
})

/**
 * While the loading or error overlay is shown it covers the whole wrapper at
 * z-index 10, so Exit must still sit above it to remain usable.
 */
test('the Exit button stays clickable while the overlay is shown', async ({ page }) => {
  await page.setContent(toolbarFixture({ overlay: true }))

  await expect(page.locator('#overlay')).toBeVisible()

  const box = await page.locator('#exit').boundingBox()
  const hit = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.id ?? null,
    { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 },
  )

  expect(hit).toBe('exit')
  await page.locator('#exit').click({ timeout: 2000 })
})
