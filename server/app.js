const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');
const CONST = require('./const');

const app = express();

let inwiseUrl = 'http://inwise.macrowing.com:8089';
app.use(
  createProxyMiddleware('/api', {
    target: inwiseUrl, 
    changeOrigin: true,
    onProxyRes(proxyRes) {
      proxyRes.headers['x-real-url'] = inwiseUrl;
    },
    pathRewrite: {
      '^/api': '', // rewrite path
    },
  }),
);

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
app.listen(CONST.port);