const { AsyncSeriesHook } = 'tapable'
import { Compilation } from './compilation'
/**
 * webpack 是基于tapable事件流，tapable本质是发布订阅，可以使webpack在特定的时间节点触发相应的hook
 * 在webpack整个生命周期中传递的一直是compiler对象，
 */
class Compiler {
  constructor(context, options) {
    this.options = options
    this.hooks = Object.freeze({
      // {AsyncSeriesHook}是tapable框架提供的事件触发函数：表示异步串行
      run: new AsyncSeriesHook(['compiler']),
      emit: new AsyncSeriesHook(['compilation']),
    })
  }
  // 发送
  emit() {
    // 确认输出文件
    // let output = path.join(this.options.output.path,this.options.output.filename )
    // let templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
    // 把生成代码写入定义的output文件
  }
  // 执行
  run() {
    console.log('执行自定义webpack')
    // run的时候开始分析构建模块
    // this.buildMoudle()
    this.hooks.beforeRun.callAsync(this, (err) => {
      if (err) return
      this.hooks.run.callAsync(this, (err) => {
        if (err) return
        this.complie(this.buildMoudle)
      })
    })
  }
  complie(callback) {
    const params = ''
    const compilation = new Compilation(params)
    this.hooks.beforeCompile.callAsync(params, (err) => {
      this.hooks.compile.call(params)
      // webpack核心流程make
      /**
       * make阶段的主要目标是
       * 根据entry配置找到入口模块，一次递归所有依赖项，生成依赖树，将递归的每个模块交给不同的loader处理
       *
       * 由于webpack是基于发布订阅，因此在内部自定义了部分内部plugin做事件处理
       */
      this.hooks.make.callAsync(compilation, (err) => {})
    })
  }
}
export function createCompiler(options) {
  const compiler = new Compiler(options.context, options)
  // 开发插件使用插件调用方法apply方法
  if (Array.isArray(options.plugins)) {
    options.plugins.forEach((plugin) => {
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler)
      } else {
        plugin.apply(compiler)
      }
    })
  }
  return compiler
}
