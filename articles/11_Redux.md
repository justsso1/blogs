# Redux

标签（空格分隔）： redux 状态管理 

---
Finally, to tie state and actions together, we write a function called a reducer.
最后，为了将状态和动作联系在一起，我们编写了一个名为reducer的函数。


it’s just a function that takes state and action as arguments, and returns the next state of the app
它只是一个将状态和动作作为参数的函数，并返回应用程序的下一个状态。


**Three Principles**  **三个原则** 

Redux 可以用三个基本的原则来描述：

1. Single source of truth  单一来源的真理

 The state of your whole application is stored in an object tree within a single store.
    `store.getState()`

2. State is read-only   状态只读

     The only way to change the state is to emit an action, an object describing what happened.
    改变状态的唯一方法是发出一个动作，一个描述所发生事情的对象。

3. Changes are made with pure functions 使用纯函数改变

    To specify how the state tree is transformed by actions, you write pure reducers.
    要指定状态树如何通过操作进行转换，您需要编写纯粹的reducers。

You can start with a single reducer, and as your app grows, split it off into smaller reducers that manage specific parts of the state tree. Because reducers are just functions, you can control the order in which they are called, pass additional data, or even make reusable reducers for common tasks such as pagination

你可以从一个简化程序开始，随着应用程序的增长，你可以把它拆分成更小的简化程序来管理状态树的特定部分。因为还原剂只是函数，所以您可以控制它们被调用的顺序，传递额外的数据，甚至可以为常见的任务(如分页)制作可重用的还原剂。

```
import { combineReducers, createStore } from 'redux'
const reducer = combineReducers({ visibilityFilter, todos })
const store = createStore(reducer)
```
**Learning Resources**
`connect` function 

Taking Advantage of `combineReducers`

`selector` functions 

Stack Overflow: Why do we need middleware for async flow in Redux?


