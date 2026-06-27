// tests/__mocks__/@mlightcad/cad-viewer.js
module.exports = {
  // Vue 3 plugin — must expose install() so vueApp.use(i18n) does not throw
  i18n: {
    install(_app, _options) {},
  },
  // Minimal Vue 3 component — must have render() so createApp() does not throw
  MlCadViewer: {
    name: 'MlCadViewer',
    render() {
      return null;
    },
  },
};
