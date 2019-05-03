# react学习-生命周期v16.8.6

##### componentDidMount 组件挂载

##### componentWillUnmount 组件卸载

class组件提供了更加丰富的功能，需要继承`React.Component`

**生命周期速查表** [http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

步骤：

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

### 错误处理

当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：

Static  getDerivedStateFromError()

componentDidCatch()

