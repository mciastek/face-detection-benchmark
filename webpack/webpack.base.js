const PROD_ENV = process.env.NODE_ENV === 'production'
const ENV_FILE = process.env.ENV_FILE

const envFilePath = ENV_FILE ? `./.env.${ENV_FILE}` : './.env'

require('dotenv').config({
  path: envFilePath
})

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin')
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin')

const APP_DIR = path.resolve(__dirname, '..', 'src')
const BUILD_DIR = path.resolve(__dirname, '..', 'dist')

const metaData = require('../meta-data')

module.exports = {
  entry: [`${APP_DIR}/app.js`],
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: ['babel-loader'],
        exclude: /node_modules\/(?!lit-html)/
      },
      {
        test: /\.svg$/i,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: 'svg-inline-loader'
          },
          {
            use: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: ['file-loader?hash=sha512&digest=hex&name=[hash].[ext]']
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
          partialDirs: [path.resolve(__dirname, '..', 'src/components/ui')]
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      images: path.resolve(__dirname, '..', 'src/images'),
      services: path.resolve(__dirname, '..', 'src/services'),
      adapters: path.resolve(__dirname, '..', 'src/adapters'),
      store: path.resolve(__dirname, '..', 'src/store'),
      views: path.resolve(__dirname, '..', 'src/views'),
      utils: path.resolve(__dirname, '..', 'src/utils'),
      libs: path.resolve(__dirname, '..', 'src/libs'),
      fonts: path.resolve(__dirname, '..', 'src/fonts'),
      styles: path.resolve(__dirname, '..', 'src/styles'),
      public: path.resolve(__dirname, '..', 'src/public'),
      root: path.resolve(__dirname, '..', 'src')
    }
  },
  plugins: [
    new Dotenv({
      systemvars: true,
      path: envFilePath
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: `${APP_DIR}/index.hbs`,
      production: PROD_ENV,
      meta: metaData,
      GAKey: process.env.GA_KEY
    }),
    new HtmlWebpackInlineSVGPlugin({
      runPreEmit: true
    }),
    new CopyWebpackPlugin([
      {
        from: './src/public',
        ignore: PROD_ENV ? ['three.js'] : undefined
      }
    ]),
    new ModernizrWebpackPlugin({
      options: ['setClasses', 'prefixed'],
      'feature-detects': ['webgl'],
      filename: 'modernizr[hash]',
      noChunk: true,
      htmlWebpackPlugin: true
    })
  ],
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  }
}
