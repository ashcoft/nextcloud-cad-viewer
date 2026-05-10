const path = require('path');

const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'cad-viewer.js',
    library: 'CadViewer',
    libraryTarget: 'umd',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js',
      'three/examples/jsm/controls/OrbitControls': 'three/addons/controls/OrbitControls.js',
      'three/examples/jsm/libs/stats.module': 'three/addons/libs/stats.module.js',
      // Provide empty modules for Node.js built-ins
      'fs': path.resolve(__dirname, 'src/polyfills/empty.js'),
      'path': path.resolve(__dirname, 'src/polyfills/empty.js'),
      'crypto': path.resolve(__dirname, 'src/polyfills/empty.js')
    }
  },
  externals: {
    '@nextcloud/axios': 'OCA.Core.Axios',
    '@nextcloud/router': 'OCA.Core.Router',
    '@nextcloud/l10n': 'OCA.Core.L10n',
    '@nextcloud/files': 'OCA.Files',
    'element-plus': 'elementPlus',
    '@mlightcad/cad-viewer': 'cadViewer',
    '@mlightcad/cad-simple-viewer': 'cadSimpleViewer',
    'three': 'three'
  }
};














