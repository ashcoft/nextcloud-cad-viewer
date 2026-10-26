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

/**
 * The Save/Exit toolbar sits above the viewer's canvas. The viewer's root is
 * `position: fixed; inset: 0; z-index: 2` and the app's stylesheet makes
 * #cad-viewer-container its containing block, so the viewer covers the whole
 * container — including the toolbar. Without a higher stacking context on the
 * toolbar the buttons were in the DOM but painted over, so they could neither
 * be seen nor clicked.
 *
 * This reproduces the real element nesting and checks that the toolbar wins the
 * hit test at the position of its buttons.
 */
const TOOLBAR_H = 37

function toolbarFixture(): string {
  return `<!doctype html><html><head><style>${css}
    /* The viewer ships this rule inside its JS bundle, so it is not part of the
       app stylesheet and must be reproduced here for the overlap to occur. */
    .ml-cad-viewer-container {
      position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 2;
      pointer-events: auto; overflow: hidden;
    }
    .cad-viewer-wrapper { position: relative; }
    .cad-viewer-toolbar {
      display: flex; align-items: center; gap: .5rem; padding: .5rem .75rem;
      background: #2b2b2b; flex: 0 0 auto; height: ${TOOLBAR_H}px; box-sizing: border-box;
    }
  </style></head>
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
          </div>
        </div>
      </div>
    </body></html>`
}

test('the Save/Exit toolbar is not covered by the viewer canvas', async ({ page }) => {
  await page.setContent(toolbarFixture())

  const toolbar = await page.locator('#toolbar').boundingBox()
  const viewer = await page.locator('#viewer').boundingBox()

  expect(toolbar).not.toBeNull()
  expect(viewer).not.toBeNull()

  // The viewer must start below the toolbar, not underneath it.
  expect(viewer!.y).toBeGreaterThanOrEqual(toolbar!.y + TOOLBAR_H)

  // And the toolbar must win the hit test where its buttons are.
  for (const id of ['save', 'exit']) {
    const box = await page.locator(`#${id}`).boundingBox()
    const hit = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.id ?? null,
      { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 },
    )
    expect(hit).toBe(id)
  }

  // The buttons must actually receive a click.
  await page.locator('#save').click()
  await page.locator('#exit').click()
})
