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
    // Redirect @mlightcad optional plugin /register subpath imports to empty stubs
    // Using explicit pattern matching to avoid path traversal false positives
    new webpack.NormalModuleReplacementPlugin(
      /^@mlightcad\/cad-html-plugin\/register$/,
      (result) => {
        result.request = path.resolve(__dirname, 'src/polyfills/cad-html-plugin-register.cjs');
      }
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^@mlightcad\/cad-pdf-plugin\/register$/,
      (result) => {
        result.request = path.resolve(__dirname, 'src/polyfills/cad-pdf-plugin-register.cjs');
      }
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^@mlightcad\/cad-svg-plugin\/register$/,
      (result) => {
        result.request = path.resolve(__dirname, 'src/polyfills/cad-svg-plugin-register.cjs');
      }
    ),
    // Ignore @mlightcad/dxf-json-converter which has version mismatch with data-model
    new webpack.IgnorePlugin({
      resourceRegExp: /^@mlightcad\/dxf-json-converter$/,
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json', '.cjs'],
    alias: {
      vue$: 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, 'src'),
      'three/examples/jsm/controls/OrbitControls$': 'three/examples/jsm/controls/OrbitControls.js',
      'three/examples/jsm/libs/stats.module$': 'three/examples/jsm/libs/stats.module.js',
      fs: path.resolve(__dirname, 'src/polyfills/empty.js'),
      path: path.resolve(__dirname, 'src/polyfills/empty.js'),
      crypto: path.resolve(__dirname, 'src/polyfills/empty.js'),
      stream: false,
      // Optional plugins for @mlightcad/cad-viewer 1.5.2+
      '@mlightcad/cad-pdf-plugin': path.resolve(__dirname, 'src/polyfills/cad-pdf-plugin-register.cjs'),
      '@mlightcad/cad-svg-plugin': path.resolve(__dirname, 'src/polyfills/cad-svg-plugin-register.cjs'),
      '@mlightcad/cad-html-plugin': path.resolve(__dirname, 'src/polyfills/cad-html-plugin-register.cjs'),
    },
    fallback: {
      stream: false,
      fs: false,
      path: false,
      crypto: false,
    },
  },
  performance: {
    hints: false,
  },
};
