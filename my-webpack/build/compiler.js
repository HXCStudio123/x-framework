const {AsyncSeriesHook} = 'tapable'
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
  // 创建模块（即source->chunk的中间态），分析模块的依赖关系
  buildMoudle() {
    // 1. 从入口开始分析模块间的依赖关系，构建依赖树
    // 2. 分析的过程中 使用parse解析模块，
    // 3. 递归处理依赖节点
  }
  // 拿到模块的依赖后，递归解析（AST语法解析）
  parse() {
    // ast
    // parse
    // traverse
    // 分析的过程中就可以使用loader进行解析
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
    this.hooks.beforeRun.callAsync(this, err=>{
      if(err) return
      this.hooks.run.callAsync(this, err=>{
        if(err) return
        this.complie(this.buildMoudle)
      })
    })
  }
  complie(callback) {
    const params = ''
    this.hooks.beforeCompile.callAsync(params, err => {
      this.hooks.compile.call(params);
      this.hooks.make.callAsync('', err=> {
        
      })
    })
  }
}
export function createCompiler(options) {
  const compiler = new Compiler(options.context, options)
  // 开发插件使用插件调用方法apply方法
  if(Array.isArray(options.plugins)) {
    options.plugins.forEach(plugin => {
      if(typeof plugin === 'function') {
        plugin.call(compiler, compiler)
      } else {
        plugin.apply(compiler)
      }
    });
  }
  return compiler
}