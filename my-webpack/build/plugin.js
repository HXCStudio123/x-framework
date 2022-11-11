const pluginName = 'CustomDelPlugin'
class CustomDelPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack正在启动', compiler.toString(), compilation.toString())
      // test
      
    })
  }
}
module.exports = CustomDelPlugin
