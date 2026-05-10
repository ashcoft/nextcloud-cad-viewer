const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'cad-viewer.js',
    library: 'CadViewer',
    libraryTarget: 'window',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js',
      // Fix three.js module resolution for packages that import without .js extension
      'three/examples/jsm/controls/OrbitControls$': 'three/examples/jsm/controls/OrbitControls.js',
      'three/examples/jsm/libs/stats.module$': 'three/examples/jsm/libs/stats.module.js',
      // Provide empty modules for Node.js built-ins
      'fs': path.resolve(__dirname, 'src/polyfills/empty.js'),
      'path': path.resolve(__dirname, 'src/polyfills/empty.js'),
      'crypto': path.resolve(__dirname, 'src/polyfills/empty.js'),
    },
  },
  performance: {
    hints: false,
  },
};
