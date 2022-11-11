# webpack源码解析

webpack基于tapable框架（伪代码）

## 关键环节

1. webpack cli启动打包流程
2. 载入webpack核心模块 创建compiler对象
3. 使用compiler对象对整个项目进行编译
4. 从入口文件开始，解析模块依赖，形成依赖关系树
5. 递归的分析依赖树，在分析的过程中使用对应loader
6. 合并loader处理完的结果，将打包结果输出到对应的输出目录当中

### webpack-cli

将cli的初始化配置和webpack中的用户配置进行合并，得到一个完整的合并对象。

```node

```
