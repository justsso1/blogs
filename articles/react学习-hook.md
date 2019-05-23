# react学习-hook

Hook是react 16.8 新增的特性，可以让你在不编写class的情况下，使用state以及其他的react特性。

useFunction 一般作为hook



当我们使用 `useSatate` 定义 state 变量时候，它返回一个有两个值的数组。第一个值是当前的 state，第二个值是更新 state 的函数。使用 `[0]` 和 `[1]` 来访问有点令人困惑，因为它们有特定的含义。这就是我们使用数组解构的原因。