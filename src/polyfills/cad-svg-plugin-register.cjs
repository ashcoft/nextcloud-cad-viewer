// Stub for the optional @mlightcad/cad-svg-plugin "/register" subpath only.
//
// cad-viewer imports the *named* export `registerLazySvgPlugin` from
// "@mlightcad/cad-svg-plugin/register" to register the SVG export plugin
// lazily; this stub keeps that lazy registration out of the bundle.
exports.registerLazySvgPlugin = function registerLazySvgPlugin() {
  return null;
};
