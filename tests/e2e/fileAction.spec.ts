import { test, expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * End-to-end coverage for the built init script (js/cad-viewer.js).
 *
 * The script runs on the Files page and must register the "Open with CAD
 * Viewer" file action, which is what makes a single click on a DWG/DXF file
 * open the app's viewer.
 *
 * The Nextcloud Files runtime is not available in CI, so the page provides a
 * minimal stub of the pieces the script touches (@nextcloud/files registry,
 * @nextcloud/l10n and @nextcloud/router). The real bundle is loaded from a
 * URL (so its automatic public path resolves) and exercised in a browser.
 */

const bundlePath = resolve(__dirname, '../../js/cad-viewer.js')

/** Install the Nextcloud stubs and serve the built bundle. */
async function loadInitScript(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as Record<string, unknown>
    w.OC = { PERMISSION_READ: 1 }
    w.OCA = {}
    w.t = (_app: string, text: string) => text
    w.n = (_app: string, singular: string) => singular

    // Minimal @nextcloud/files registry, exposed on the global scope the
    // bundle reads it from.
    w._nc_files_scope = {
      v4_0: {
        fileActions: new Map(),
        registry: { dispatchTypedEvent: () => {} },
      },
    }
  })

  await page.route('**/*', (route) => {
    const url = route.request().url()
    if (url.endsWith('/cad-viewer.js')) {
      return route.fulfill({
        contentType: 'application/javascript',
        body: readFileSync(bundlePath, 'utf8'),
      })
    }
    return route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html><head></head><body></body></html>',
    })
  })

  await page.goto('/apps/cad_viewer/')
  await page.addScriptTag({ url: '/apps/cad_viewer/js/cad-viewer.js' })
}

test('registers the "Open with CAD Viewer" file action', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await loadInitScript(page)

  const action = await page.evaluate(() => {
    const actions = (
      window as unknown as {
        _nc_files_scope: { v4_0: { fileActions: Map<string, unknown> } }
      }
    )._nc_files_scope.v4_0.fileActions
    return actions.get('cad-viewer-open') ?? null
  })

  expect(action).not.toBeNull()
  expect(errors).toEqual([])
})

test('the action is enabled only for CAD files', async ({ page }) => {
  await loadInitScript(page)

  const results = await page.evaluate(() => {
    const actions = (
      window as unknown as {
        _nc_files_scope: {
          v4_0: {
            fileActions: Map<
              string,
              { enabled?: (context: { nodes: unknown[] }) => boolean }
            >
          }
        }
      }
    )._nc_files_scope.v4_0.fileActions
    const action = actions.get('cad-viewer-open')
    if (!action?.enabled) {
      return null
    }

    const file = (mime: string, basename: string) => ({ type: 'file', mime, basename })
    return {
      dwg: action.enabled({ nodes: [file('application/dwg', 'plan.dwg')] }),
      dxf: action.enabled({ nodes: [file('image/vnd.dxf', 'plan.dxf')] }),
      octet: action.enabled({ nodes: [file('application/octet-stream', 'plan.dwg')] }),
      pdf: action.enabled({ nodes: [file('application/pdf', 'plan.pdf')] }),
      folder: action.enabled({ nodes: [{ type: 'folder', mime: 'httpd/unix-directory', basename: 'plan.dwg' }] }),
    }
  })

  expect(results).toEqual({ dwg: true, dxf: true, octet: true, pdf: false, folder: false })
})
