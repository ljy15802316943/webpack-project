const path = require('path');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(webpackConfig, {
  mode: 'production',
  optimization: {
    //压缩代码，删除多余的代码
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
});