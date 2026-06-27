const t = "PdfPlugin", e = ["cpdf", "ipdf"];
function i(n) {
  n.registerLazyPlugin({
    name: t,
    triggers: [...e],
    loader: async () => {
      const { createPdfPlugin: r } = await import("@mlightcad/cad-pdf-plugin");
      return r();
    }
  });
}
export {
  t as PDF_PLUGIN_NAME,
  e as PDF_PLUGIN_TRIGGERS,
  i as registerLazyPdfPlugin
};
