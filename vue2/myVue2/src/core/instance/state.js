// 初始化状态：props,methods,data,computed,watch
export function initState(vm) {
  const ops = vm.$options
  // if (ops.props)  initProps(vm, opts.props)
  // if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    // observe(vm._data = {}, true /* asRootData */)
  }
  // if (opts.computed) initComputed(vm, opts.computed)
  // if (opts.watch && opts.watch !== nativeWatch) {
  //   initWatch(vm, opts.watch)
  // }
}
// 初始化data
function initData(vm) {
  let data = vm.$options.data
  // 如果data是一个函数，通过getData获取返回值；不然就返回data || {}
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  // 有一个是否为纯对象的判断，后续加上。
  // ...
  
  // 代理实例上的数据
  const keys = Object.keys(data)
  const props = vm.props
  const methods = vm.methods
  let i = keys.length
  while(i--) {
    const key = keys[i]
    // 判断重名
    if (methods && methods.hasOwnProperty(key)) {
      throw(`Method "${key}" has already been defined as a data property.`)
    }
    if (props && props.hasOwnProperty(key)) {
      throw(`props "${key}" has already been defined as a data property.`)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
// 从函数中获取data
export function getData (data, vm) {
  pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}