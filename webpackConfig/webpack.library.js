const path = require('path');
const toml = require('toml');
const yaml = require('yamljs');
const json5 = require('json5');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../library/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../library-dist'),
    filename: '[name].js',
    //解决commonjs this指向问题 self is not defined
    globalObject: 'this',
    clean: true,
    library: {
      name: "library",
      type: 'umd'
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        include: path.resolve(__dirname, '../library'), 
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    "targets": {
                      "chrome": "60",
                      "firefox": "60",
                      "ie": "11",
                      "safari": "10",
                      "edge": "17"
                    },
                    "corejs": {
                      "version": 3
                    },
                    "useBuiltIns": "usage",
                  }
                ],
                ['@babel/preset-react'], // 通过preset-react 支持jsx
                ['@babel/preset-typescript'] //支持ts
              ],
              plugins: [
                ["@babel/plugin-transform-runtime", {
                  "corejs": 3
                }],
                // 编译es7语法。
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose": false }]
              ]
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', "css-loader"],
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader', "css-loader", 'less-loader',
        ],
      },
      {
        // 当模块运行在 CommonJS 上下文中，这将会变成一个问题，也就是说此时的 this 指向的是 module.exports。
        // 在这种情况下，你可以通过使用 imports-loader 覆盖 this 指向
        test: path.resolve('../library/index.tsx'),
        use: 'imports-loader?wrapper=window',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
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
  //排除打包库
  externals: {
    antd: 'antd',
    react: 'react',
    ReactDOM: 'react-dom',
  },
  plugins: [
    new webpack.ProgressPlugin(),
  ]
};