const PENDING = 'pending' //进行中
const FULFILLED = 'fulfilled' //成功
const REJECTED = 'rejected' //失败
const timeFn = (cb: Function) => {
  setTimeout(cb, 0)
}
type MyPromiseResult = string | number | undefined
class MyPromise {
  private status?: string
  private result?: MyPromiseResult
  private reason?: MyPromiseReason
  private onFullfiledList?: Array<Function>
  private onRejectedList?: Array<Function>
  constructor(exec?: Function) {
    try {
      this.initState()
      exec && exec(this._resolve.bind(this), this._reject.bind(this))
    } catch (e:any) {
      this._reject(e)
    }
  }
  private initState() {
    this.status = PENDING
    this.onFullfiledList = []
    this.onRejectedList = []
  }
  private _resolve(val: MyPromiseResult) {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.result = val
    while (this.onFullfiledList?.length) {
      this.onFullfiledList?.shift()?.call(this, val)
    }
  }
  private _reject(err: MyPromiseReason) {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = err
    while (this.onRejectedList?.length) {
      this.onRejectedList?.shift()?.call(this, err)
    }
  }
  // 按顺序执行then的链式调用，因此使用数组存储，前一个的返回值作为后一个then的入参处理
  then(onFullfiled?: Function, onRejected?: Function): MyPromise {
    return new MyPromise((resolve: Function, reject: Function) => {
      // 获取上一步操作的full或者reject
      // 如果上一步获取的是 成功 执行当前方法
      // 将then操作保存起来，保证链式调用 不然每次拿不到参数
      const onResolvFn = (val: MyPromiseResult) => {
        const cb = () => {
          try {
            if (typeof onFullfiled !== 'function') {
              resolve(val)
              return
            }
            const result = onFullfiled(val)
            if (MyPromise.isPromise(result)) {
              // 返回值是promise
              result.then(resolve, reject)
              return
            }
            resolve(result)
          } catch (e: any) {
            reject(e)
            throw new Error(e)
          }
        }
        timeFn(cb)
      }
      // 如果上一步获取的是 失败 抛错
      const onRejectFn = (reason: MyPromiseReason) => {
        const cb = () => {
          try {
            if (typeof onRejected !== 'function') {
              resolve(reason)
              return
            }
            const result = onRejected(reason)
            resolve(result)
          } catch (e: any) {
            reject(e)
            throw new Error(e)
          }
        }
        timeFn(cb)
      }
      if (this.status === PENDING) {
        // 等待状态
        this.onFullfiledList?.push(onResolvFn)
        this.onRejectedList?.push(onRejectFn)
      } else if (this.status === FULFILLED) {
        onResolvFn(this.result)
      } else {
        onRejectFn(this.reason)
      }
    })
  }
  catch(onRejected?: Function) {
    return this.then(undefined, onRejected)
  }
  /**
   * 无论怎样结果，接收上一个状态的返回值作为入参，并且以该入参为返回值传递下去
   */
  finally(cb: Function) {
    return this.then(
      (val: MyPromiseResult)=>MyPromise.resolve(cb()).then(()=>val),
      (reason: MyPromiseResult)=>MyPromise.resolve(cb()).then(()=>{throw new Error(reason)})
    )
  }
  /**
   * 成功: 全部成功
   * 失败: 有一个失败抛错
   * @return {MyPromise} 返回结果数组
   */
  static all(promises: Array<MyPromise>): MyPromise {
    let count = promises.length
    let result = new Array(count)
    return new MyPromise((resolve: Function, reject: Function) => {
      const add = (res: any, index: number) => {
        count--
        result[index] = res
        if (count === 0) resolve(result)
      }
      promises.forEach((promise, index) => {
        if (MyPromise.isPromise(promise)) {
          promise.then(
            (res: MyPromiseResult) => add(res, index),
            reject
          )
        } else {
          add(promise, index)
        }
      })
    })
  }
  /**
   * 接收一个Promise数组，数组中如有非Promise项，则此项当做成功
   * 哪个Promise最快得到结果，就返回那个结果，无论成功失败
   * @param promises 
   * @returns 
   */
  static race(promises: Array<MyPromise>): MyPromise{
    return new MyPromise((resolve: Function, reject: Function) => {
      promises.forEach((promise)=>{
        if(MyPromise.isPromise(promise)) {
          promise.then(resolve, reject)
        } else {
          resolve(promise)
        }
      })
    })
  }
  /**
   * 接收一个Promise数组，数组中如有非Promise项，则此项当做成功
   * 把每一个Promise的结果，集合成数组，返回
   * @param promises 
   * @returns 
   */
  static allSettled(promises: Array<MyPromise>): MyPromise{
    let result = new Array(promises.length)
    let count = promises.length
    return new MyPromise((resolve: Function, reject: Function)=>{
      const add = (status: string, res: any, index: number)=>{
        count--
        result[index] = {
          status,
          res
        }
        if(count === 0) {
          resolve(result)
        }
      }
      promises.forEach((promise, index)=>{
        if(MyPromise.isPromise(promise)) {
          promise.then((res: MyPromiseResult) => add(FULFILLED, res, index), (err: any)=>add(REJECTED, err, index))
        } else {
          add(FULFILLED, promise, index)
        }
      })
    })
  }
  /**
   * 接收一个Promise数组，数组中如有非Promise项，则此项当做成功,
   * 如果有一个Promise成功，则返回这个成功结果
   * 如果所有Promise都失败，则报错
   * @param promises 
   * @returns 
   */
  static any(promises: Array<MyPromise>): MyPromise{
    let count = promises.length
    return new MyPromise((resolve: Function, reject: Function)=>{
      const add = ()=>{
        count--
        if(count === 0) {
          reject('所有项均失败')
        }
      }
      promises.forEach((promise, index)=>{
        if(MyPromise.isPromise(promise)) {
          promise.then(resolve, (err: any)=> add())
        } else {
          resolve(promise)
        }
      })
    })
  }
  static isPromise (val: any) {
    return val && val instanceof MyPromise
  }
  static resolve(res: any) {
    if(MyPromise.isPromise(res)) {
      return res
    }
    return new MyPromise((resolve: Function)=>{
      if(res && typeof res.then === 'function' ) {
        res.then(resolve)
        return
      }
      resolve(res)
    })
  }
}

export { MyPromise }
