const CustomDelPlugin = require('./build/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    entry1: './src/main.js',
    entry2: './src/main1.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: './build/loader.js',
      },
    ],
  },
  plugins: [
    new CustomDelPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index1.html',
      template: 'public/index.html',
      chunks: ['entry1'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index2.html',
      template: 'public/index.html',
      chunks: ['entry2'],
    }),
  ],
  optimization: {
    usedExports: true,
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
  },
}
