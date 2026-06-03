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
        // Handles .ts, .tsx, .js, .jsx — including <script lang="ts"> blocks from vue-loader
        test: /\.[jt]sx?$/,
        loader: 'babel-loader',
        // Still apply fullySpecified: false to all JS/TS files to handle mlightcad issues
        resolve: {
          fullySpecified: false,
        },
        exclude: /node_modules/,
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
