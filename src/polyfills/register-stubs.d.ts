// Type declarations for the optional plugin register stubs.
//
// These .cjs files are webpack-only stubs for the "@mlightcad/<plugin>/register"
// subpaths of packages the app does not install; the tests import them to assert
// they expose the named exports the viewer imports.

declare module '*/cad-onedrive-plugin-register.cjs' {
  export function registerOneDrivePlugin(pluginManager?: unknown, options?: unknown): void
}

declare module '*/cad-google-drive-plugin-register.cjs' {
  export function registerGoogleDrivePlugin(pluginManager?: unknown, options?: unknown): void
}
