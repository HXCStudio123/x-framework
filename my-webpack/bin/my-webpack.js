#! /usr/bin/env node

console.log('测试自定义webpack')

function run(argv) {
  console.log(...argv)
}

run(process.argv)