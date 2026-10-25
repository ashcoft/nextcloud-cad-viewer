// Stub for the optional @mlightcad/cad-html-plugin.
//
// cad-viewer imports the *named* export `registerLazyHtmlPlugin` from
// "@mlightcad/cad-html-plugin/register". The Nextcloud app does not bundle
// that plugin, but webpack still has to resolve the specifier, so provide the
// same named export.
exports.registerLazyHtmlPlugin = function registerLazyHtmlPlugin() {
  return null;
};
