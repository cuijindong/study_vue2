## 引入vue.js文件的时候Vue都做了什么？
调试vue源码的准备工作：1.创建一个html文件。2.在html中引入vue.js。下面是vue源码的入口文件，看看都做了些什么。
```javascript
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```
1. 引入了initMixin、stateMixin、renderMixin、eventsMixin、lifecycleMixin、warn 六个模块，其中warn时打印警告用的，没啥卵用。
2. 创建一个Vue函数，函数首先判断如果当前环境不是生产环境并且this不是Vue函数的实例时打印一个警告。然后执行this._init(options)
3. 将Vue函数分别传入initMixin、stateMixin、renderMixin、eventsMixin、lifecycleMixin并执行。
### 问题一
Vue函数中this是什么，this._init函数又是哪来的。
#### 答案
this是在调用new Vue() 时的当前实例。
this._init函数是在initMixin(Vue)时添加到Vue函数原型上的方法。
```javascript
export function initMixin (Vue: Class<Component>) {
  // 将_init挂载到Vue原型。
  Vue.prototype._init = function (options?: Object) {
    ...
  }
}
```
### 问题二
initMixin、stateMixin、renderMixin、eventsMixin、lifecycleMixin是在何时执行的。
#### 答案
在引入vue.js文件时执行。
## new Vue(options)的时候做了什么？
在执行new Vue的时候仅执行了this._init(options),在执行this._init(options)主要进行了如下操作。
1. initLifecycle(vm) 初始化生命周期
2. initEvents(vm) 初始化事件
3. initRender(vm) 初始化渲染
4. callHook(vm, 'beforeCreate') 触发beforeCreate钩子
5. initInjections(vm) 添加inject挂载
6. initState(vm)  初始化 Props/methods/data/computed/watch，数据劫持等
7. initProvide(vm) 添加provide
8. callHook(vm, 'created') 触发created钩子
9. 最后vm.$mount(vm.$options.el) 经行挂载。