const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Worker scripts and WASM binaries the CAD viewer loads at runtime by URL.
// They are not imported by the bundle, so they must be copied verbatim.
//   - libredwg-parser-worker.js + libredwg-web.wasm: DWG parsing (LibreDWG)
//   - mtext-renderer-worker.js: MTEXT layout/shaping
const runtimeAssets = [
  {
    from: path.resolve(__dirname, 'node_modules/@mlightcad/libredwg-converter/dist/libredwg-parser-worker.js'),
    to: path.resolve(__dirname, 'assets/libredwg-parser-worker.js'),
  },
  {
    from: path.resolve(__dirname, 'node_modules/@mlightcad/libredwg-converter/dist/libredwg-web.wasm'),
    to: path.resolve(__dirname, 'assets/libredwg-web.wasm'),
  },
  {
    from: path.resolve(__dirname, 'node_modules/@mlightcad/cad-simple-viewer/dist/mtext-renderer-worker.js'),
    to: path.resolve(__dirname, 'assets/mtext-renderer-worker.js'),
  },
];
module.exports = {
  entry: {
    'cad-viewer': './src/main.ts',
    'adminSettings': './src/adminSettings.js',
  },
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: '[name].js',
    library: 'CadViewer',
    libraryTarget: 'window',
    // `auto` derives the chunk base from the loaded entry script URL, so the
    // lazily imported viewer chunks resolve under /apps/cad_viewer/js/ rather
    // than relative to the current route.
    publicPath: 'auto',
    clean: true,
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
    // The CAD viewer loads its workers from "./assets/<name>" relative to the
    // page, i.e. /apps/cad_viewer/assets/. Emit them there (the app root is
    // served statically by Nextcloud).
    new CopyWebpackPlugin({ patterns: runtimeAssets }),
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
    new webpack.NormalModuleReplacementPlugin(
      /^@mlightcad\/cad-onedrive-plugin\/register$/,
      (result) => {
        result.request = path.resolve(__dirname, 'src/polyfills/cad-onedrive-plugin-register.cjs');
      }
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^@mlightcad\/cad-google-drive-plugin\/register$/,
      (result) => {
        result.request = path.resolve(__dirname, 'src/polyfills/cad-google-drive-plugin-register.cjs');
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
      // @mlightcad/cad-simple-viewer's "./icons" subpath ships raw .ts source
      // under its "import" export condition (a packaging bug), which babel-loader
      // can't transpile because node_modules is excluded. Redirect the bare
      // import to the compiled "lib/ui/icons.js" target (the package's "default"
      // condition) so webpack gets valid transpiled JS.
      '@mlightcad/cad-simple-viewer/icons$': path.resolve(
        __dirname,
        'node_modules/@mlightcad/cad-simple-viewer/lib/ui/icons.js',
      ),
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
