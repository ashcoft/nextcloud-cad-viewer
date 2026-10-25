// Stub for the optional @mlightcad/cad-svg-plugin.
//
// cad-viewer imports the *named* export `registerLazySvgPlugin` from
// "@mlightcad/cad-svg-plugin/register". The Nextcloud app does not bundle
// that plugin, but webpack still has to resolve the specifier, so provide the
// same named export.
exports.registerLazySvgPlugin = function registerLazySvgPlugin() {
  return null;
};
