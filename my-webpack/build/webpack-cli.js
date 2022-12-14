/**
 * webpack-cli核心流程
 * webpack-cli中存储了webpack中的所有的配置参数json串
 * 将用户传入和默认进行合并获得初始化后的配置
 */
import { webpack } from "./webpack"
const path = require('path')

// 模拟传入的配置
const configOptions = {
  entry: 'main.js',
  output: 'bundle.js',
}

let options = {
  entry: 'index.js',
  output: 'bundle.js',
}
// 源码const loadedConfig = await loadConfigByPath(foundDefaultConfigFile.path, options.argv);
Object.assign(options, configOptions)

// --------------------获取参数后--------------------
/**
 * 调用核心模块获取到compiler对象，
 * compiler负责完成整个项目的构建工作
 */
const compiler = webpack(options)
compiler.run()
