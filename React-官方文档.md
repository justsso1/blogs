官方文档

JavaScript工具链

主要概念
介绍 JSX
一种表达式，更接近js而不是html
尽量用一个括号包住jsx表达式，因为防止“引号自动插入”

如果一个标签是空的，要使用 />关闭它


JSX防止注入攻击

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


Rendering Elements 渲染元素

元素是React应用程序中最小的构建模块
元素与组件的概念不同

更新渲染元素
元素是不可变的，像电影中的一帧。想要更新就创建一个新的元素，然后传入ReactDOM.render()

React只更新那些必要的东西

Components and Props
