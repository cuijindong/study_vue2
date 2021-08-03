import Dep, {pushTarget, popTarget} from './dep.js'

let uid = 0

/**
 * 观察者解析一个表达式，收集依赖关系，并在表达式的值发生变化时触发回调。这被用于$watch() api和指令。
 */
export default class Watcher {
  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }

    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = expOrFn.toString()  // expOrFn可能是表达式或函数
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }

    this.value = this.lazy ? undefined : this.get()
  }
  /**
   * 给这个指令添加一个依赖关系。
   */
  addDep(dep) {
    const id = dep.id
    // 避免重复添加
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
  /**
   * 评估getter，并重新收集依赖关系。
   */
  get() {
    pushTarget(this)
    let value
    const vm = this.vm
    value = this.getter.call(vm, vm)
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    // if (this.deep) {
    //   traverse(value)
    // }
    popTarget()
    this.cleanupDeps()
  }
  /**
   * 清理依赖性的收集
   */
  cleanupDeps() {
    let i = this.deps.length
    while(i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
  /**
   * 订阅者接口。当依赖关系改变时将被调用。
   */
  update() {
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
}