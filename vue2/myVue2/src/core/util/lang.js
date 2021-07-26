/**
 * 定义一个属性.
 */
export function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,   // 第一个!转布尔，第二个!把布尔值同步。
    writable: true,
    configurable: true
  })
}