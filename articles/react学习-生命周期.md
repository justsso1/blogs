# react学习-生命周期v16.8.6

class组件提供了更加丰富的功能，需要继承`React.Component`

**生命周期速查表** [http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

*react生命周期阶段：*

### 组件挂载

##### 	constructor 构造函数(唯一可以给this.state赋值的地方)

###### 	static getDerivedStateFromProps 

##### 	render 渲染

##### 	ComponentDidMount 组件挂载

##### 	componentWillUnmount 组件卸载

当组件的`props`或者`state`改变的时候，`render`函数都会被重新调用

#### 	state的更新方法：

出于性能考虑，react可能把多个`setState()`调用合并成一个调用。

因为`this.state`和`this.props`可能是异步更新的，所以不要依赖他们的值去更新下一个状态。

​	**异步更新state**

```react
this.setState(state, props => ({
	counter: state.counter + props.increment
}))
```

#### 	数据流： 自上而下【单向】

任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“低于”它们的组件。

如果你把一个以组件构成的树想象成一个 props 的数据瀑布的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动。

在React应用中，组件是有状态组件还是无状态组件属于组件的实现细节，它可能会随着时间的推移发生改变。你你可以在有状态组件中使用无状态组件，反之亦然。

### 更新

当组件的props和state发生变化时会触发更新。组件更新的生命周期调用顺序如下：

1. Static  getDerivedStateFromProps()

2. ShouldComponentUpdate()

3. render()

4. getSnapshotBeforeUpdate()

5. componentDidUpdate()

### 卸载

componentWillUnmount()

### React 16 中的错误处理

当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：

Static  getDerivedStateFromError()

```react
static getDerivedStateFromError(error)
```

```react
componentDidCatch(error, info)
```

此生命周期在后代组件抛出错误后被调用。 它接收两个参数：

1. `error` —— 抛出的错误。
2. `info` —— 带有 `componentStack` key 的对象，其中包含[有关组件引发错误的栈信息](https://zh-hans.reactjs.org/docs/error-boundaries.html#component-stack-traces)。

```react
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

请注意，**错误边界仅捕获树中它们下面的组件中的错误**。错误边界本身无法捕获错误。如果错误边界尝试呈现错误消息失败，则错误将传播到其上方最接近的错误边界。这也类似于`catch {}`JavaScript在JavaScript中的工作方式。

componentWillRecieveProps(){}快被弃用了