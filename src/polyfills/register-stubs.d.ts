// Type declarations for the optional plugin register stubs.
//
// These .cjs files are webpack-only stubs for the "@mlightcad/<plugin>/register"
// subpaths; the tests import them to assert they expose the named exports the
// viewer imports.

declare module '*/cad-pdf-plugin-register.cjs' {
  export function registerLazyPdfPlugin(pluginManager?: unknown): void
}

declare module '*/cad-html-plugin-register.cjs' {
  export function registerLazyHtmlPlugin(pluginManager?: unknown, options?: unknown): void
}

declare module '*/cad-svg-plugin-register.cjs' {
  export function registerLazySvgPlugin(pluginManager?: unknown): void
}

declare module '*/cad-onedrive-plugin-register.cjs' {
  export function registerOneDrivePlugin(pluginManager?: unknown, options?: unknown): void
}

declare module '*/cad-google-drive-plugin-register.cjs' {
  export function registerGoogleDrivePlugin(pluginManager?: unknown, options?: unknown): void
}
