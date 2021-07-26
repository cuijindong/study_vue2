import { arrayMethods } from './array'

import {
  def,
  hasProto
} from '../util/index'
/**
 * Observer类
 */
export class Observer{
  constructor(value) {
    this.value = value
    this.dep = new Dep()    // ?
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        // 将重写的数组方法挂载到value的原型（__proto__）上
        protoAugment(value, arrayMethods)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  /**
   * 给对象所有属性添加getter/setter,仅当value类型是Object时调用
   */ 
  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
  /**
   * 数组每一项,如果是对象添加响应式，但不是对象就return了
   */
  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers
/**
 * 通过__proto__拦截原型链来增强目标对象或数组
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  target.__proto__ = src
}

/**
 * 尝试为值创建observer实例
 * 1.如果成功observed，返回新的observer，
 * 2.如果这个值已经有observer，就返回该observer
 */
export function observer(value, asRootData) {
  // 判断是否为对象和由VNode创建
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  // 被返回的observer
  let ob;
  // 2.如果这个值已经有observer，就返回该observer
  if(value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {  // 1.如果成功observed，返回新的observer，
    ob = new Observer(value)
  }
  // 不知道干嘛的
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
/**
 * 为Object的一个属性定义响应式
 */
export function defineReactive(obj, key, val, customSetter, shallow) {
  const dep = new Dep()   // ?
  if (arguments.length === 2) {
    val = obj[key]
  }
  // 如果不是浅响应式，就为属性的值在加响应式
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = val
      if (newVal === value) {
        return
      }
      val = newVal

      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}