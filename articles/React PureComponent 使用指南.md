React15.3中新加了一个 `PureComponent` 类，顾名思义， `pure` 是纯的意思，`PureComponent`也就是纯组件，取代其前身 `PureRenderMixin` ,`PureComponent` 是优化 `React` 应用程序最重要的方法之一，易于实施，只要把继承类从 `Component` 换成 `PureComponent` 即可，可以减少不必要的 `render` 操作的次数，从而提高性能，而且可以少写 `shouldComponentUpdate` 函数，节省了点代码

