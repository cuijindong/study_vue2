import { remove } from "../util/index.js";
/**
 * 一个dep是一个可以有多个指令subscribing(订阅)的observable。
 */
let uid = 0;
export default class Dep {
  static target;
  id;
  subs;
  constructor() {
    this.id = uid++;
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  removeSub(sub) {
    remove(this.subs, sub);
  }
  depend() {
    if (Dep.target) {
      // 把Dep.target添加到this.subs。Dep.target应该是一个Watcher
      Dep.target.addDep(this)
    }
  }
  notify() {
    // 先稳定订阅者名单(深拷贝)
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      // 订阅者更新
      subs[i].update()
    }
  }
}


// 当前被评估的目标观察者。
// 这在全球是独一无二的，因为只有一个观察者
Dep.target = null
const targetStack = []

export function pushTarget (target) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}