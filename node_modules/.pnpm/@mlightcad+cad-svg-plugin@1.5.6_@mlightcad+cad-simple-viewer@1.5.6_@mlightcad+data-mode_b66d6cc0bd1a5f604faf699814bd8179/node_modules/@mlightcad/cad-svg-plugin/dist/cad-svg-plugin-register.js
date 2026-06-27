const r = "SvgPlugin", t = ["csvg"];
function e(g) {
  g.registerLazyPlugin({
    name: r,
    triggers: [...t],
    loader: async () => {
      const { createSvgPlugin: n } = await import("@mlightcad/cad-svg-plugin");
      return n();
    }
  });
}
export {
  r as SVG_PLUGIN_NAME,
  t as SVG_PLUGIN_TRIGGERS,
  e as registerLazySvgPlugin
};
