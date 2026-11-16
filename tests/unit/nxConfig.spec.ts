/// <reference types="jest" />
/**
 * `nx.json` marks the `build` target cacheable, so a cache hit skips webpack and
 * restores the declared `outputs` instead. Webpack writes the viewer bundle to
 * `js/` (output.path) and copies its runtime workers and WASM into `assets/`.
 * Neither directory is among Nx's default outputs, so if `outputs` does not list
 * them a cache hit reports success while restoring nothing and the app ships
 * without its JavaScript or DWG worker.
 *
 * Both configs are read as text: importing webpack.config.js pulls in vue-loader,
 * which needs a Vue-aware transform this Jest setup lacks.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const nxConfig = JSON.parse(readFileSync(resolve(__dirname, '../../nx.json'), 'utf8'))
const webpackSource = readFileSync(resolve(__dirname, '../../webpack.config.js'), 'utf8')

// Webpack's real output roots, taken from the config rather than hardcoded.
const bundleDir = /output:\s*\{[^}]*path:\s*path\.resolve\(__dirname,\s*'([^']+)'\)/s.exec(
  webpackSource,
)?.[1]
// Only the CopyWebpackPlugin `to:` destinations, i.e. lines copying a `from:`
// into a directory, not resolve aliases elsewhere in the config.
const assetDirs = [
  ...webpackSource.matchAll(/from:.*\n\s*to:\s*path\.resolve\(__dirname,\s*'([^/']+)\//g),
].map((match) => match[1])

describe('nx build caching', () => {
  const build = nxConfig.targetDefaults?.build

  it('caches the build target', () => {
    expect(build?.cache).toBe(true)
  })

  it('declares the directory webpack bundles into', () => {
    expect(bundleDir).toBeDefined()
    expect(build?.outputs).toContain(`{projectRoot}/${bundleDir}`)
  })

  it('declares every directory webpack copies runtime assets into', () => {
    expect(assetDirs.length).toBeGreaterThan(0)
    for (const dir of new Set(assetDirs)) {
      expect(build?.outputs).toContain(`{projectRoot}/${dir}`)
    }
  })
})
