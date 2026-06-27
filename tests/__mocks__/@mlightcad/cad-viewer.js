module.exports = {
  // Vue 3 plugin – must have an install() method so vueApp.use(i18n) works
  i18n: {
    install(_app, _options) {},
  },
  // Minimal Vue 3 component definition
  MlCadViewer: {
    name: 'MlCadViewer',
    render() { return null; },
  },
};
