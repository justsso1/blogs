# React官方文档

JavaScript工具链

## 主要概念

### 介绍JSX

**在jsx中使用表达式**

一种表达式，更接近js而不是html
尽量在JSX 代码的外面扩上一个小括号，防止 分号自动插入 的 bug

如果 JSX 标签是闭合式的，那么你需要在结尾处用 `/>`, 就好像 `XML/HTML` 一样

**JSX防止注入攻击**

By default, React DOM escapes any values embedded in JSX before rendering them. Thus it ensures that you can never inject anything that’s not explicitly written in your application. Everything is converted to a string before being rendered. This helps prevent XSS (cross-site-scripting) attacks
默认情况下，React DOM在呈现JSX中的任何值之前都会转义。因此，它确保您永远不能注入任何没有显式地写入应用程序的内容。在呈现之前，所有内容都被转换为字符串。这有助于防止跨站脚本攻击

Babel   将 JSX 编译为 React.createElement()，其实React.createElement( )创建了一个对象，类似如下：

// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};

### Rendering Elements 元素渲染

元素是React应用程序中最小的构建模块
元素与组件的概念不同

更新渲染元素
元素是不可变的，像电影中的一帧。想要更新就创建一个新的元素，然后传入ReactDOM.render()

React只更新那些必要的东西

### Components and Props 组件&props



### State&生命周期

