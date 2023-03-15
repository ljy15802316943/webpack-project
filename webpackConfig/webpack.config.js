const path = require('path');
const toml = require('toml');
const yaml = require('yamljs');
const json5 = require('json5');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin') //引入html-webpack-plugin 插件
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ReactRefreshTypeScript = require('react-refresh-typescript');
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    pathinfo: false,
    clean: true,
  },
  module: {
    rules: [
      {
        // 当模块运行在 CommonJS 上下文中，这将会变成一个问题，也就是说此时的 this 指向的是 module.exports。
        // 在这种情况下，你可以通过使用 imports-loader 覆盖 this 指向
        test: path.resolve('../src/index.tsx'),
        use: 'imports-loader?wrapper=window',
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        include: path.resolve(__dirname, '../src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    "useBuiltIns": "usage",
                    "corejs": {
                      "version": 2
                    },
                    "targets": {
                      "chrome": "60",
                      "firefox": "60",
                      "ie": "9",
                      "safari": "10",
                      "edge": "17"
                    }
                  }
                ],
                ['@babel/preset-react'], // 通过preset-react 支持jsx
                ['@babel/preset-typescript'] // 加上这一句
              ],
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
                [
                  "@babel/plugin-transform-runtime", {
                    "corejs": {
                      "version": 2
                    },
                  }
                ],
                // 配置antd按需引入css。
                [
                  "import",
                  {
                    "libraryName": "antd",
                    "libraryDirectory": "es",
                    "style": "css"
                  }
                ],
                // 编译es7语法。
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose": false }]
              ]
              .filter(Boolean)
            },
          },
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: () => {
                return ({
                  before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
                }) 
              } ,
              transpileOnly: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, '../src'),
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          publicPath: './images/',
          outputPath: 'images',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          publicPath: './icons/',
          outputPath: 'icons',
        },
      },
      {
        test: /\.txt/,
        type: 'asset/source',
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader']
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader']
      },
      {
        test: /\.toml$/i,
        type: 'json',
        parser: {
          parse: toml.parse,
        },
      },
      {
        test: /\.yaml$/i,
        type: 'json',
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.json5$/i,
        type: 'json',
        parser: {
          parse: json5.parse,
        },
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  //去掉打包资产大小限制警告
  performance: {
    maxEntrypointSize: 10000000,
    maxAssetSize: 30000000
  },
  optimization: {
    //每个chunks文件打上id标记,防止重复打包.
    moduleIds: 'deterministic',
    //提取重复引入的对象实例到一个runtime-chunks,解决多次重复新创建引用地址.
    runtimeChunk: 'single',
    //开启Tree Shaking
    usedExports: true,
    //检查所有代码分割出共同的chunks
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
  //排除打包库
  externals: {
    // lodash: {
    //   root: '_',
    // },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/document.ejs')
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, '../public'), 
          to: path.resolve(__dirname, '../dist'),
          noErrorOnMissing: true,
        },
      ],
    }),
    new webpack.ProgressPlugin(),
  ]
};