
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const webpackConfig = require('../webpackConfig/webpack.config');
module.exports = merge(webpackConfig, {
  mode: 'development',
  stats: "errors-only",
  devtool: 'inline-source-map',
  entry: [
    //必须这么写，这将连接到服务器，以便在包重新构建时接收通知，然后相应地更新客户端
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    path.resolve(__dirname, '../src/index.tsx')
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      WEBPACK_SERVER: true,
    }),
  ],
});