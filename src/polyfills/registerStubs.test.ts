/// <reference types="jest" />
/**
 * The cad-viewer bundle imports *named* exports from the optional plugin
 * `/register` subpaths. For the two packages the app does not install, the stub
 * must expose the exact name the viewer imports; a default export alone resolves
 * to `undefined` at runtime and breaks opening a file.
 *
 * The PDF, SVG and HTML plugins are real dependencies and must NOT be stubbed:
 * replacing their `/register` with a no-op leaves the lazy plugin unregistered,
 * and the viewer then fails with "PDF export plugin is not available. Install
 * @mlightcad/cad-pdf-plugin." even though the package is installed.
 *
 * The assertions below read the actual replacement rules out of the webpack
 * config rather than looking for a package name as a substring: the config
 * writes its specifiers as regex literals (`\/register`), and a rule can name
 * several plugins at once, so a substring check passes even when a stub is
 * reintroduced.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as onedrive from './cad-onedrive-plugin-register.cjs'
import * as googleDrive from './cad-google-drive-plugin-register.cjs'

const webpackConfig = readFileSync(resolve(__dirname, '../../webpack.config.js'), 'utf8')

/** Plugins the app does not install, and so may stub. */
const STUBBABLE = ['onedrive', 'google-drive']

interface Replacement {
  /** The specifier pattern, with regex escapes removed. */
  pattern: string
  /** The file the pattern redirects to. */
  target: string
}

/** Every NormalModuleReplacementPlugin rule, as pattern plus target. */
function replacements(): Replacement[] {
  const rule = /NormalModuleReplacementPlugin\(\s*(\/(?:[^/\\]|\\.)+\/)\s*,\s*\(?result\)?\s*=>\s*\{\s*result\.request\s*=\s*path\.resolve\(__dirname,\s*'([^']+)'\)/g
  const found: Replacement[] = []

  let match: RegExpExecArray | null
  while ((match = rule.exec(webpackConfig)) !== null) {
    found.push({ pattern: match[1].replace(/\\/g, ''), target: match[2] })
  }

  return found
}

describe('optional plugin register stubs', () => {
  it('expose the named exports cad-viewer imports', () => {
    expect(typeof onedrive.registerOneDrivePlugin).toBe('function')
    expect(typeof googleDrive.registerGoogleDrivePlugin).toBe('function')
  })

  it('reads the replacement rules out of the webpack config', () => {
    expect(replacements().length).toBeGreaterThan(0)
  })

  /**
   * A rule may only redirect the `/register` subpath of a plugin the app does
   * not install, and only to that plugin's own stub. A rule naming several
   * plugins at once cannot be paired with a single stub, so it fails here.
   */
  it('stubs only the plugins the app does not install', () => {
    for (const { pattern, target } of replacements()) {
      const named = /cad-([a-z-]+)-plugin\/register/.exec(pattern)

      expect(named).not.toBeNull()
      expect(STUBBABLE).toContain(named![1])
      expect(target).toBe(`src/polyfills/cad-${named![1]}-plugin-register.cjs`)
    }
  })

  /**
   * The three installed plugins must keep their real `/register` module, which
   * is what registers the lazy plugin and its triggers.
   */
  it.each(['pdf', 'svg', 'html'])('does not redirect the %s plugin', (plugin) => {
    const specifier = `@mlightcad/cad-${plugin}-plugin/register`

    for (const { pattern } of replacements()) {
      expect(pattern).not.toContain(specifier)
    }
  })
})
