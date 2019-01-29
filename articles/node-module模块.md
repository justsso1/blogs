# module模块

## 模块包装器

在执行模块代码之前，Node.js会使用一个如下的函数包装器将其包装：

```node
(function (exports, require, module, __filename, __dirname) {
    //模块的代码实际上在这里
});

```