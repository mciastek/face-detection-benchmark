const path = require('path')
const Dotenv = require('dotenv-webpack')
const nodeExternals = require('webpack-node-externals')

const base = require('./webpack.base')

const BUILD_DIR = path.resolve(__dirname, '..', 'dist')
const SERVER_DIR = path.resolve(__dirname, '..', 'server')

module.exports = {
  mode: 'production',
  entry: [`${SERVER_DIR}/index.js`],
  output: {
    path: BUILD_DIR,
    filename: 'server.js',
    libraryTarget: 'commonjs2',
    publicPath: '/'
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  externals: [nodeExternals(), /rev-manifest.json/, /public-manifest.json/],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new Dotenv()],
  resolve: base.resolve
}
