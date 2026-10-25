// Stub for the optional @mlightcad/cad-pdf-plugin.
//
// cad-viewer imports the *named* export `registerLazyPdfPlugin` from
// "@mlightcad/cad-pdf-plugin/register" to register the PDF export/import
// plugin lazily. The Nextcloud app does not bundle that plugin, but webpack
// still has to resolve the specifier, so provide the same named export.
exports.registerLazyPdfPlugin = function registerLazyPdfPlugin() {
  return null;
};
