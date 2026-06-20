const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'cad-viewer.js',
    library: 'CadViewer',
    libraryTarget: 'window',
    clean: true,
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        resolve: {
          fullySpecified: false,
        },
        exclude: [/node_modules/, /\.vue$/],
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, 'src'),
      'three/examples/jsm/controls/OrbitControls$': 'three/examples/jsm/controls/OrbitControls.js',
      'three/examples/jsm/libs/stats.module$': 'three/examples/jsm/libs/stats.module.js',
      'fs': path.resolve(__dirname, 'src/polyfills/empty.js'),
      'path': path.resolve(__dirname, 'src/polyfills/empty.js'),
      'crypto': path.resolve(__dirname, 'src/polyfills/empty.js'),
      // Optional plugins for @mlightcad/cad-viewer 1.5.2+
      // These are peer dependencies marked as optional
      '@mlightcad/cad-pdf-plugin': path.resolve(__dirname, 'src/polyfills/empty.js'),
      '@mlightcad/cad-svg-plugin': path.resolve(__dirname, 'src/polyfills/empty.js'),
      '@mlightcad/cad-html-plugin': path.resolve(__dirname, 'src/polyfills/empty.js'),
    },
  },
  performance: {
    hints: false,
  },
};
