const path = require('path');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin') //引入html-webpack-plugin 插件

module.exports = merge(webpackConfig, {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'webpack-number.js',
    //解决commonjs this指向问题 self is not defined
    globalObject: 'this',
    library: {
      name: "webpackNumbers",
      type: 'umd'
    },
  },
  mode: 'production',
  //排除指定包
  externals: {
    // lodash: {
    //   root: '_',
    // },
  },
  optimization: {
    //关闭Tree Shaking
    usedExports: false,
    //关闭代码分离
    runtimeChunk: false,
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
})