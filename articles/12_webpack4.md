style-loader 来解决这个问题，它会负责为我们的样式生成 style 标签并插入到页面中。

Webpack 对于 loader 的配置形式。loader 的执行顺序是从右向左


不同的文件的处理，我们需要loader来处理，处理成js能够认别的文件


Webpack的一个优点是：按需加载、异步加载
ES6中的import()可以实现动态加载

 output 中添加了一个配置项 publicPath，它是 Webpack 中一个很重要又很容易引起迷惑的配置。当我们的工程中有按需加载以及图片和文件等外部资源时就需要它来配置这些资源的路径，否则页面上就会报 404。

构建速度

检测依赖大小的工具叫 slow-deps，通过它我们可以找到哪些东西影响了 npm install 的速度。

---
![logo](https://github.com/webpack/media/blob/master/logo/icon-square-big.jpg)

### 安装

```
npm install webpack
npm install webpack-cli 
```
webpack-cli（此工具用于在命令行中运行 webpack）

### 执行打包命令

```
npx webpack

```
Node 8.2+ 版本提供的 npx 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件（./node_modules/.bin/webpack）：



`file-loader  处理各种文件(font)的loader`
### 管理输出
`HtmlWebpackPlugin 插件 html模版文件`生成的html文件可以动态的添加打包的bundle文件，不用再手动的去一个个添加了

`clean-webpack-plugin` 是一个比较普及的管理插件,每次构建之前先清理dist目录

webpack配置中devtool: 'inline-source-map'可以定位到源代码中哪一行出错了


webpack观察者模式，webpack-watch 唯一的缺点是，为了看到修改后的实际效果，你需要刷新浏览器。如果能够自动刷新浏览器就更好了，可以尝试使用 webpack-dev-server，恰好可以实现我们想要的功能。

webpack-dev-server 为你提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)。
需要尝试 Hot Moudle Replacement 模块热替换

HMR : 它允许在运行时更新各种模块，而无需进行完全刷新。
HMR 不适用于生产环境，这意味着它应当只在开发环境使用。

使用webpack-dev-server 和webpack 内置的 HMR 插件启用HRM功能。

建议为每个环境编写彼此独立的 webpack 配置

虽然，以上我们将生产环境和开发环境做了略微区分，但是，请注意，我们还是会遵循不重复原则(Don't repeat yourself - DRY)，保留一个“通用”配置。为了将这些配置合并在一起，我们将使用一个名为 webpack-merge 的工具。

### 代码分离

防止重复(prevent duplication)
CommonsChunkPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。