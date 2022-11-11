const { createCompiler } = require("./compiler")

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
  return compiler
}
module.exports = { webpack }
