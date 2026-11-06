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
 * @mlightcad/cad-pdf-plugin." even though the package is installed. The
 * webpack-config assertions below guard that.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as onedrive from './cad-onedrive-plugin-register.cjs'
import * as googleDrive from './cad-google-drive-plugin-register.cjs'

const webpackConfig = readFileSync(resolve(__dirname, '../../webpack.config.js'), 'utf8')

describe('optional plugin register stubs', () => {
  it('expose the named exports cad-viewer imports', () => {
    expect(typeof onedrive.registerOneDrivePlugin).toBe('function')
    expect(typeof googleDrive.registerGoogleDrivePlugin).toBe('function')
  })

  it.each(['pdf', 'svg', 'html'])(
    'does not stub the %s plugin, which is a real dependency',
    (plugin) => {
      expect(webpackConfig).not.toContain(`cad-${plugin}-plugin/register`)
      expect(webpackConfig).not.toContain(`cad-${plugin}-plugin-register.cjs`)
    },
  )
})
