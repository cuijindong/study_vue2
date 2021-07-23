/**
 * 尝试为值创建observer实例
 * 1.如果成功observed，返回新的observer，
 * 2.如果这个值已经有observer，就返回该observer
 */
export function observer(value, asRootData) {
  // 判断是否为对象和由VNode创建
  // if (!isObject(value) || value instanceof VNode) {
  //   return
  // }
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