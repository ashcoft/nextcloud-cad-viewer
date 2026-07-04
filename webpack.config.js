const path = require('path');
const webpack = require('webpack');
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
        options: {
          esModule: true,
        },
      },
      {
        // Use ts-loader for TypeScript transpilation
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          appendTsSuffixTo: [/\.vue$/],
          happyPackMode: true,
        },
        exclude: /node_modules/,
      },
      {
        // Handles .js, .jsx (excluding .ts and .vue)
        test: /\.[jt]sx?$/,
        loader: 'babel-loader',
        resolve: {
          fullySpecified: false,
        },
        exclude: [/node_modules/, /\.vue$/, /\.ts$/],
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
    // Redirect mlightcad plugin register paths to empty polyfill
    new webpack.NormalModuleReplacementPlugin(
      /@mlightcad\/cad-html-plugin\/register/,
      path.resolve(__dirname, 'src/polyfills/empty.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /@mlightcad\/cad-svg-plugin\/register/,
      path.resolve(__dirname, 'src/polyfills/empty.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /@mlightcad\/cad-pdf-plugin\/register/,
      path.resolve(__dirname, 'src/polyfills/empty.js')
    ),
  ],
  resolve: {
    // Allow resolving modules from root node_modules even when in nested paths
    modules: ['node_modules', path.resolve(__dirname, 'node_modules')],
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
      '@mlightcad/cad-pdf-plugin/register': path.resolve(__dirname, 'src/polyfills/empty.js'),
      '@mlightcad/cad-svg-plugin': path.resolve(__dirname, 'src/polyfills/empty.js'),
      '@mlightcad/cad-svg-plugin/register': path.resolve(__dirname, 'src/polyfills/empty.js'),
      '@mlightcad/cad-html-plugin': path.resolve(__dirname, 'src/polyfills/empty.js'),
      '@mlightcad/cad-html-plugin/register': path.resolve(__dirname, 'src/polyfills/empty.js'),
    },
  },
  performance: {
    hints: false,
  },
};
