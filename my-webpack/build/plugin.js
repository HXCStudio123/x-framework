const pluginName = 'CustomDelPlugin'
/**
 * plugin利用了 tapable 的事件发布订阅机制，可以挂载在webpack的暴露的每一环节的hook
 * 在插件里写apply方法
 */
class CustomDelPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack正在启动', compiler.toString(), compilation.toString())
      // test
      
    })
  }
}
module.exports = CustomDelPlugin
