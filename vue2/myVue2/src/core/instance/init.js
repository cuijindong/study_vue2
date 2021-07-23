import { initState } from './state'

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // 判断是否为组件
    if (options && options._isComponent) {
      // 优化内部组件瞬间
      // 由于动态选项合并速度相当缓慢，并且内部组件选项均不需要特殊处理。
      // initInternalComponent(vm, options)
    } else {
      // 合并配置
      // vm.$options = mergeOptions(
      //   resolveConstructorOptions(vm.constructor),
      //   options || {},
      //   vm
      // )
      vm.$options = options
    }
    // 创建响应式
    initState(vm)
  }
}