import { initState } from './state'

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // 判断是否为组件
    if (options && options._isComponent) {
      initInternalComponent(vm, options)
    } else {
      // 合并配置
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    // 创建响应式
    initState(vm)
  }
}