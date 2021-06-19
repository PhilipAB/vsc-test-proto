//@ts-check

'use strict';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

/**@type {import('webpack').Configuration[]}*/
const config = [
  {
    mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    entry: {
      extension: './extension/src/extension.ts' // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    },
    output: {
      // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
      path: path.resolve(__dirname, '..', 'dist'),
      filename: '[name]/[name].js',
      libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    externals: {
      vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    },
    resolve: {
      // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
            },
          ],
        },
      ],
    },
  },
  {
    mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    target: 'web', // (default) react app runs in a web context
    entry: {
      panel: './app/src/coursePanel/index.tsx', // the entry point of the react app
      sidebar: './app/src/sidebar/index.tsx' // the entry point of the sidebar
    },
    output: {
      // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
      path: path.resolve(__dirname, '..', 'dist'),
      filename: '[name]/[name].js'
    },
    devtool: 'source-map',
    resolve: {
      // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
      // support reading jsx and tsx files for react
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      fallback: {
        // the following packages are not included in webpack build by default
        // we need them to decode our jwt
        "buffer": require.resolve("buffer"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "crypto": require.resolve("crypto-browserify")
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader'
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            }
          ]
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
      ]
    },
    plugins: [
      // new webpack.DefinePlugin({
      //   // fixes the "process is not defined" error in webpack 5 -> there might be a better solution?
      //   // eslint-disable-next-line @typescript-eslint/naming-convention
      //   'process.env.NODE_ENV': JSON.stringify('none')
      // }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  }
];
module.exports = config;