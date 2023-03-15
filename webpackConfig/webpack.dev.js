const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(webpackConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    //热更新局部，阻止全部更新。
    new ReactRefreshWebpackPlugin(),
  ],
  devServer: {
    static: '../dist',
    hot: true,
  }
})