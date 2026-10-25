// Stub for the optional @mlightcad/cad-html-plugin "/register" subpath only.
//
// cad-viewer imports the *named* export `registerLazyHtmlPlugin` from
// "@mlightcad/cad-html-plugin/register" to register the HTML export plugin
// lazily; this stub keeps that lazy registration out of the bundle. The bare
// "@mlightcad/cad-html-plugin" package itself is bundled, because cad-viewer
// imports real values from it.
exports.registerLazyHtmlPlugin = function registerLazyHtmlPlugin() {
  return null;
};
