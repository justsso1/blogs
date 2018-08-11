## React 16 新特性

Protals
可以把组件渲染到当前组件树意外的DOM节点上。典型应用是弹框

ReactDOM.createPortal(child, container)


## 组件通信

**父子组件通信**
props以及回调函数

**兄弟组件通信**
层级不多，可以同一个父组件传递props
层级很多，使用context通信。在提供context的组件内新增一个getChildContext方法，返回context对象，然后在组件的childContextTypes属性上定义context对象的属性的类型信息。

## 高阶组件