/// <reference types="jest" />
/**
 * The cad-viewer bundle imports *named* exports from the optional plugin
 * `/register` subpaths. The stubs must expose those exact names; a default
 * export alone resolves to `undefined` at runtime and breaks opening a file
 * with "registerLazyPdfPlugin is not a function".
 *
 * Each stub is imported statically so the assertion also fails the build if a
 * stub stops being resolvable.
 */
import * as pdf from './cad-pdf-plugin-register.cjs'
import * as html from './cad-html-plugin-register.cjs'
import * as svg from './cad-svg-plugin-register.cjs'
import * as onedrive from './cad-onedrive-plugin-register.cjs'
import * as googleDrive from './cad-google-drive-plugin-register.cjs'

describe('optional plugin register stubs', () => {
  it('expose the named exports cad-viewer imports', () => {
    expect(typeof pdf.registerLazyPdfPlugin).toBe('function')
    expect(typeof html.registerLazyHtmlPlugin).toBe('function')
    expect(typeof svg.registerLazySvgPlugin).toBe('function')
    expect(typeof onedrive.registerOneDrivePlugin).toBe('function')
    expect(typeof googleDrive.registerGoogleDrivePlugin).toBe('function')
  })
})
