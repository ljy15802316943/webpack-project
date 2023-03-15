const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();

//获取node-webpack配置
const compiler = webpack(require('./server.webpack.config'));

app.use(
  //使用webpack-dev-middleware中间件, 配置热更新.
  webpackDevMiddleware(compiler, {
    publicPath: '/',
  }),
  //使用webpack-hot-middleware中间件，热更新才能生效.
  webpackHotMiddleware(compiler)
);

//将文件 serve 到 port 3000。
app.listen(3000, function() {
  console.log('http://localhost:3000/');
});