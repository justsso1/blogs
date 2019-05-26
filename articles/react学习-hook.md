# react学习-hook

Hook是react 16.8 新增的特性，可以让你在不编写class的情况下，使用state以及其他的react特性。

useFunction 一般作为hook



当我们使用 `useSatate` 定义 state 变量时候，它返回一个有两个值的数组。第一个值是当前的 state，第二个值是更新 state 的函数。使用 `[0]` 和 `[1]` 来访问有点令人困惑，因为它们有特定的含义。这就是我们使用数组解构的原因。



#### 使用effect hook

**Effect Hook** 在函数组件中，执行副作用操作。

在react中有两种常见的副作用操作： 需要清除的和不需要清除的。

**为什么在组件内部调用 useEffect？** 将 `useEffect` 放在组件内部让我们可以在 effect 中直接访问 `count` state 变量（或其他 props）。我们不需要特殊的 API 来读取它 —— 它已经保存在函数作用域中。Hook 使用了 JavaScript 的闭包机制，而不用在 JavaScript 已经提供了解决方案的情况下，还引入特定的 React API。

**useEffect 会在每次渲染后都执行吗？** 是的，默认情况下，它在第一次渲染之后*和*每次更新之后都会执行。（我们稍后会谈到[如何控制它](https://zh-hans.reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)。）你可能会更容易接受 effect 发生在“渲染之后”这种概念，不用再去考虑“**挂载**”还是“**更新**”。React 保证了每次运行 effect 的同时，DOM 都已经更新完毕。

每次我们重新渲染，都会生成*新的* effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect “属于”一次特定的渲染。

```react
import React, {useState, useEffect} from 'react';

function MyEffect() {

    const [count, setCount] = useState(0);

    useEffect(() => {
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



effect函数返回一个函数，来清除副作用。



并不需要特定的代码来处理更新逻辑，因为 `useEffect` *默认*就会处理。它会在调用一个新的 effect 之前对前一个 effect 进行清理





### 提示: 通过跳过 Effect 进行性能优化



### 自定义hook

