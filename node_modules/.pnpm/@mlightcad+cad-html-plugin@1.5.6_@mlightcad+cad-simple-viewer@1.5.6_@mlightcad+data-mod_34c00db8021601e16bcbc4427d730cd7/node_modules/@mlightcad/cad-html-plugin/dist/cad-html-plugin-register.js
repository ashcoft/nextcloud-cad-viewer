const r = "HtmlPlugin", e = ["chtml"];
function i(t) {
  t.registerLazyPlugin({
    name: r,
    triggers: [...e],
    loader: async () => {
      const { createHtmlPlugin: n } = await import("@mlightcad/cad-html-plugin");
      return n();
    }
  });
}
export {
  r as HTML_PLUGIN_NAME,
  e as HTML_PLUGIN_TRIGGERS,
  i as registerLazyHtmlPlugin
};
