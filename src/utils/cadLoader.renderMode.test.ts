/// <reference types="jest" />
/**
 * The viewer is mounted with the main-thread render mode by default.
 *
 * The worker render mode keeps a second copy of the drawing geometry, which
 * roughly doubles peak memory for a DWG. On a phone that was enough for the
 * browser to discard the tab, reload it, reopen the same drawing and crash
 * again — the refresh loop this guards against. The viewer component's own
 * default is the main thread, so the app must not override it with the heavier
 * mode.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const source = readFileSync(resolve(__dirname, 'cadLoader.ts'), 'utf8')

describe('cadLoader render mode', () => {
  it('defaults useMainThreadDraw to true', () => {
    expect(source).toMatch(/useMainThreadDraw\s*=\s*true/)
  })

  it('does not force the worker render mode', () => {
    expect(source).not.toMatch(/useMainThreadDraw\s*=\s*false/)
  })
})
