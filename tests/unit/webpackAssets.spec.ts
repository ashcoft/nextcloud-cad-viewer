/// <reference types="jest" />
/**
 * The CAD viewer loads its workers at runtime by URL, not through the bundle:
 *   - libredwg-parser-worker.js + libredwg-web.wasm parse DWG files
 *   - mtext-renderer-worker.js lays out MTEXT
 *
 * They are copied into the app's `assets/` directory (the viewer resolves them
 * relative to the page as "./assets/<name>"). If a copy is dropped, opening a
 * DWG fails in the worker, so guard the configuration here.
 *
 * The webpack config is read as text: importing it would pull in vue-loader,
 * which needs a Vue-aware transform this Jest setup does not provide.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const configSource = readFileSync(resolve(__dirname, '../../webpack.config.js'), 'utf8')

describe('webpack runtime assets', () => {
  it.each([
    "assets/libredwg-parser-worker.js",
    "assets/libredwg-web.wasm",
    "assets/mtext-renderer-worker.js",
  ])('copies %s', (file) => {
    expect(configSource).toContain(file)
  })
})
