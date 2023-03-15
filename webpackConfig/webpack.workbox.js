const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const WorkboxPlugin = require('workbox-webpack-plugin');


module.exports = merge(webpackConfig({mode: 'production'}), {
  devtool: 'inline-source-map',
  plugins: [
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  devServer: {
    static: '../dist',
    hot: true,
  }
});