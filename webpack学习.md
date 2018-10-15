webpack 是前端打包的工具，并不能代表前端工程化，这是两个概念。

webpack完善的构建工具

webpack配置文件

entry 入口

rules   各种loader的配置，用于处理各种类型的文件

plugins  除了文件的转换工作，满足构建中特殊的需求,比如： 代码压缩

output  输出   默认是./dist/main.js   但是可以配置，多入口多出口，配置hash，防止浏览器缓存


默认的webpack 配置是在项目下的 webpack.config.js文件中

解析文件
在js中尽量使用es6的import 来引入依赖

webpack中的模块路径解析，比node 的模块解析高级一些。webpack的模块路径解析的配置写在了resolve字段中

resolve.alias  将一个自定义的文件，配置成某个模块，这样引用的时候，可以不必总是写相对路径了
https://link.juejin.im/?target=https%3A%2F%2Fdoc.webpack-china.org%2Fconfiguration%2Fresolve%2F%23resolve-alias

webpack 依赖 enhanced-resolve 来解析代码模块的路径，webpack 配置文件中和 resolve 相关的选项都会传递给 enhanced-resolve 使用，我们介绍了这些选项的作用：

resolve.alias
resolve.extensions
resolve.modules
resolve.mainFiles
resolve.resolveLoader...


loader 应用顺序  是倒序来的。所有的 loader 按照前置 -> 行内 -> 普通 -> 后置的顺序执行

webpack 4.0 中增加了mode 参数，它有两种值： production 和 development 



<528226249@qq.com>



