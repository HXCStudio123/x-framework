function createCompiler() {
  class Compiler {
    constructor() {
      this.hooks = Object.freeze({
        // {AsyncSeriesHook}是tapable框架提供的事件触发函数：表示异步串行
        run: new AsyncSeriesHook(['compiler']),
        emit: new AsyncSeriesHook(['compilation']),
      })
    }
  }
}
function create(options) {
  let compiler
  if (Array.isArray(options)) {
    // 支持多路同时打包，当前compiler为数组
    // compiler = createMultiCompiler(options)
  } else {
    compiler = createCompiler(options)
  }
  return {
    compiler,
  }
}
function webpack(options) {
  // 创建compiler
  const { compiler } = create(options)
}
module.exports = { webpack }
