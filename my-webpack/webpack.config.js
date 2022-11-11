const CustomDelPlugin = require("./plugin");

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: './build/loader.js'
      }
    ]
  },
 plugins: [
  new CustomDelPlugin()
 ]
}