const { SyncHook, AsyncQueue } = 'tapable'
/**
 * 是准备编译模块时，才产生 compilation 对象，
 * 每次编译都会重新创建一个 compilation 对象，
 * 是 `compile` 阶段到 `make` 阶段的主要使用对象，
 * 包含了当前的模块资源、编译生成资源、变化的文件等。
 */
export class Compilation {
  constructor() {
    this.hooks = Object.freeze({
      /** @type {SyncHook<[Module]>} */
      buildModule: new SyncHook(['module']),
    })
    /** @type {AsyncQueue<Module, Module, Module>} */
    this.buildQueue = new AsyncQueue({
      name: 'build',
      parent: this.factorizeQueue,
      processor: this._buildModule.bind(this),
    })
  }
  addModuleChain(entry) {
    // 解析生成module 并push模块到依赖列表
    const module = this.handleModuleCreation(entry)
    this.buildMoudle(module, () => {})
  }
  handleModuleCreation() {}
  addEntry() {
    // 获取entry入口，开始解析
    this.addModuleChain(entry)
  }
  // 创建模块（即source->chunk的中间态），分析模块的依赖关系
  buildMoudle(module, callback) {
    // 1. 从入口开始分析模块间的依赖关系，构建依赖树
    // 2. 分析的过程中 使用parse解析模块，
    // 3. 递归处理依赖节点
    this.buildQueue.add(module, callback)
  }
  // 拿到模块的依赖后，递归解析（AST语法解析）
  parse() {
    // 使用acorn库生成ast语法树
    // ast
    // parse
    // traverse
    // 分析的过程中就可以使用loader进行解析
  }
}
