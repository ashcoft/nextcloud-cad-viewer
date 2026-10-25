// Stub for the optional @mlightcad/cad-pdf-plugin "/register" subpath only.
//
// cad-viewer imports the *named* export `registerLazyPdfPlugin` from
// "@mlightcad/cad-pdf-plugin/register" to register the PDF export/import
// plugin lazily; this stub keeps that lazy registration out of the bundle.
exports.registerLazyPdfPlugin = function registerLazyPdfPlugin() {
  return null;
};
