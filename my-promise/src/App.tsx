import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  // console.log('----', findMinDay([
  //   [0, 0, 0, 0],
  //   [0, 1, 0, 1],
  //   [0, 0, 0, 0],
  // ]))
  console.log('----', findMinDay([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
  ]))
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

function findMinDay(map: number[][]) {
  const col = map.length
  const row = map[0].length
  const paths = [[0, -1], [0, 1], [1, 0], [-1, 0]]
  let markPoint: number[][] = []
  let weight = new Array(col).fill([]).map(() => new Array(row).fill(0))
  // 权重初始化
  function calculateWeight(i: number, j: number) {
    paths.forEach(path => map[i + path[0]] && map[i + path[0]][j + path[1]] === 0 && weight[i][j]++)
  }
  function diffusion(x: number, y: number) {
    // 比较四周权重，选择最大的进行变更
    const max = paths.reduce((max, val) => {
      if (weight[x + max[0]] && weight[x + val[0]] && weight[x + max[0]][y + max[1]] > weight[x + val[0]][y + val[1]]) {
        return max
      }
      return val
    }, paths[0])
    x = x + max[0]
    y = y + max[1]
    if (weight[x] && weight[x][y] !== undefined) {
      map[x][y] = 1
      markPoint.push([x, y])
      weight[x][y] = 0
      // 选中后，周围权重更新（没有选择统一计算，因为周围只需要减1就够了）
      paths.forEach(path => weight[x + path[0]] && weight[x + path[0]][y + path[1]] && weight[x + path[0]][y + path[1]]--)
    }
  }
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      map[i][j] ? markPoint.push([i, j]) : calculateWeight(i, j)
    }
  }
  let day = 0
  while (markPoint.length && (markPoint.length < col * row)) {
    const arr = [...markPoint]
    /**
     * 可以优化查询过程，比如周围都是1的路径可以加一个标识，每次可以跳过这个节点 扩散下一个
     */
    arr.forEach(point => diffusion(point[0], point[1]))
    day++
  }
  return day
}
async function order() {
  let res: any = []
  const promises = new Array(3).fill(() => { }).map(async (item, index) => {
    return await new Promise((re) => {
      setTimeout(() => {
        res[index] = index
        console.log(index)
        re(index)
      }, 2000)
    })
  })
  console.log(promises)
  for (let promise of promises) {
    console.log(await promise)
  }
  console.log(res)
}
export default App
