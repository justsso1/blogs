# react学习-Hook

## Hook是什么

Hook是react 16.8 新增的特性，可以让你在不编写class的情况下，使用state以及其他的React特性。

React 需要为共享状态逻辑提供更好的原生途径。你可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。**Hook 使你在无需修改组件结构的情况下复用状态逻辑。** 这使得在组件间或社区内共享 Hook 变得更便捷。

Hook 是能让你在函数组件中“钩入” React 特性的函数。它们名字通常都以 `use` 开始。

### Hook: useState

当我们使用 `useState` 定义 state 变量时候，它返回一个有两个值的元组。第一个值是当前的 state，第二个值是更新 state 的函数。我们使用数组解构把他们分离出来。

第二个值是改变state的函数， 但是它不会把新的 state 和旧的 state 进行合并。而是直接替换它。

##### class的this.setState和 useState的区别：

this.setState({}) ： 新的state 和旧的state进行合并

useState(值) ： 新的state 直接替换旧的state

### HooK: useEffect

**Effect Hook** 在函数组件中，执行副作用操作，并且它与 class 中的生命周期函数极为类似。

数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用。不管你知不知道这些操作，或是“副作用”这个名字，应该都在组件中使用过它们。

>如果你熟悉 React class 的生命周期函数，你可以把 `useEffect` Hook 看做 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。

在react中有两种常见的副作用操作： 需要清除的和不需要清除的。

- <u>无需清楚的操作</u>：

**React 更新 DOM 之后运行一些额外的代码**，比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清除的操作。因为我们在执行完这些操作之后，就可以忽略他们了。



**为什么在组件内部调用 useEffect？** 将 `useEffect` 放在组件内部让我们可以在 effect 中直接访问 `count` state 变量（或其他 props）。我们不需要特殊的 API 来读取它 —— 它已经保存在函数作用域中。Hook 使用了 JavaScript 的闭包机制，而不用在 JavaScript 已经提供了解决方案的情况下，还引入特定的 React API。

**useEffect 会在每次渲染后都执行吗？** 是的，默认情况下，它在第一次渲染之后*和*每次更新之后都会执行。（我们稍后会谈到[如何控制它](https://zh-hans.reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)。）你可能会更容易接受 effect 发生在“渲染之后”这种概念，不用再去考虑“**挂载**”还是“**更新**”。React 保证了每次运行 effect 的同时，DOM 都已经更新完毕。

每次我们重新渲染，都会生成*新的* effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect “属于”一次特定的渲染。

```react
import React, {useState, useEffect} from 'react';

function MyEffect() {

    const [count, setCount] = useState(0);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
      // Update the document title using the browser API
        document.title = 'this is ' + count + '.'
    });

    return (
        <div>
            <p>
                The count is {count}
            </p>
            <button onClick={() => {
                setCount(count + 1)
            }}>点击+1
            </button>
        </div>
    )
}

export default MyEffect;

```

需要清除的副作用，例句订阅外部数据源。可以防止引起内存泄漏。

```react
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**为什么要在 effect 中返回一个函数？** 这是 effect 可选的清除机制。每个 effect 都可以返回一个清除函数。如此可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分。



**React 何时清除 effect？** React 会在组件卸载的时候执行清除操作。正如之前学到的，effect 在每次渲染的时候都会执行。这就是为什么 React *会*在执行当前 effect 之前对上一个 effect 进行清除。

并不需要特定的代码来处理更新逻辑，因为 `useEffect` *默认*就会处理。它会在调用一个新的 effect 之前对前一个 effect 进行清理

> 并不是必须为 effect 中返回的函数命名。这里我们将其命名为 `cleanup` 是为了表明此函数的目的，但其实也可以返回一个箭头函数或者给起一个别的名字。



## 小结

了解了 `useEffect` 可以在组件渲染后实现各种不同的副作用。有些副作用可能需要清除，所以需要返回一个函数，其他的 effect 可能不必清除，所以不需要返回。effect Hook 使用同一个 API 来满足这两种情况。

## 提示: 通过跳过 Effect 进行性能优化

如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React **跳过**对 effect 的调用，只要传递数组作为 `useEffect` 的第二个可选参数即可:

```react
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```



```react
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // 仅在 props.friend.id 发生变化时，重新订阅
```



### 自定义hook

