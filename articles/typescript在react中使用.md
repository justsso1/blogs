**高阶组件HOC的一些已知错误**

HOC对于要包装的组件，使用`interface` 写`props`时，属性写成可选的`?`，不然会报错，这是`typescript`已经的错误，是`typescript对`react`的声明文件没有写那么全造成的。

