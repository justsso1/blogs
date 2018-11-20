# React 16 新特性

Protals（先天的）

可以把组件渲染到当前组件树意外的DOM节点上。典型应用是弹框

**ReactDOM.createPortal(child, container)**

## 组件通信

**父子组件通信**

props以及回调函数

**兄弟组件通信**

层级不多，可以同一个父组件传递props
    
    层级很多，使用 context 通信。在提供context的组件内新增一个getChildContext方法，返回context对象，然后在组件的childContextTypes属性上定义context对象的属性的类型信息。

## 高阶组件（简称HOC）

主要用来实现组件逻辑的抽象和复用。高阶组件接收React组件作为参数，并且返回一个新的React组件，高阶组件本质上而是一个函数，并不是一个组件

`
const EnhancedComponent = higherOrderComponent(WrappedComponent)
`

高阶组件主要功能是封装并分离组件的通用逻辑，让通用逻辑在组件间更好的被复用。高阶组件的这种实现方式本质上是装饰着设计模式。

继承式的组件