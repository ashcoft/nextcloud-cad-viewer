/// <reference types="jest" />
/**
 * The cad-viewer bundle imports *named* exports from the optional plugin
 * `/register` subpaths. The stubs must expose those exact names; a default
 * export alone resolves to `undefined` at runtime and breaks opening a file
 * with "registerLazyPdfPlugin is not a function".
 */
describe('optional plugin register stubs', () => {
  it.each([
    ['cad-pdf-plugin-register', 'registerLazyPdfPlugin'],
    ['cad-html-plugin-register', 'registerLazyHtmlPlugin'],
    ['cad-svg-plugin-register', 'registerLazySvgPlugin'],
    ['cad-onedrive-plugin-register', 'registerOneDrivePlugin'],
    ['cad-google-drive-plugin-register', 'registerGoogleDrivePlugin'],
  ])('%s exposes a callable %s', (moduleName, exportName) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const stub = require(`./${moduleName}.cjs`)
    expect(typeof stub[exportName]).toBe('function')
  })
})
