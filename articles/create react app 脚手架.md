## 入门

### 更新到新版本
`create-react-app`被分成两个包。
- `create-react-app` 是一个全局的命令行包，用来创建新的项目
- `react-scripts` 是一个新创建的项目中的开发依赖

你几乎从来不需要更新`create-react-app`本身，它委托所有配置给`react-scripts`

当你运行`create-react-app`时，它总是用最新版本的`react-scripts` 创建项目。所以，你将自动的在新创建的app中使用新的特性。

将已有的项目更新到新版本的`react-scripts`,打开你文件目录中的`package.json`,迁移到新的版本。

## 开发
### 设置编辑器
如果正确的配置，create-react-app 附带了很多改善编辑体验的工具。这里是几条最大化生产力的技巧：
#### 语法高亮
#### debug
目前只有VS和webStorm支持刺功能。

Visual Studio Code和WebStorm支持使用Create React App开箱即用的调试。这使您作为开发人员可以在不离开编辑器的情况下编写和调试React代码，最重要的是，它使您能够拥有连续开发工作流，其中上下文切换最小，因为您不必在工具之间切换。

### 分离状态 开发组件
### 分析打包体积
`source-map-explorer`使用source maps 分析javascript包，这帮助你理解代码膨胀的来源。
1. `npm install --save source-map-explorer`
2. 在package.json中增加一行

  `“scripts”: {
     "analyze": "source-map-explorer build/static/js/main.*"
  }`
3. 执行打包命令和分析 命令

`npm run build`

`npm run analyze`
### 开发中使用https
你可能需要开发服务器通过https来提供页面。一个特殊的例子是，当api服务器本身是https服务时，使用代理功能将请求代理到api服务器，这可能非常有用。

**Windows (cmd.exe)**

`set HTTPS=true&& npm start`

**Windows (Powershell)**

`($env:HTTPS = "true") -add (npm start)`
**Linux, macOS(Bash)**

`HTTPS=true npm start`

请注意，服务器将使用自签名证书，因此您的Web浏览器在访问页面时几乎肯定会显示警告。
## Style and Assets

这个项目设置使用webpack处理各种资产，webpack提供了一种超越Javascript的自定义方式的扩展概念import。表示js文件依赖一个css文件，你需要`import the css from the javascript file`.

import 引入

### 添加css模块
css文件[name].module.css为扩展，则开启了css 模块。css模块使你在不同的文件中
使用相同class名字，也不会报错，不会有命名冲突。

例子：
**Button.module.css**
```
Button.module.css
.error {
  background-color: red;
}
```

**another-stylesheet.css**
```
.error {
  color: red;
}
```
**Button.js**
```
import React, { Component } from 'react';
import styles from './Button.module.css'; // Import css modules stylesheet as styles
import './another-stylesheet.css'; // Import regular stylesheet

class Button extends Component {
  render() {
    // reference as a js object
    return <button className={styles.error}>Error Button</button>;
  }
}
```
button真正的类名是 `.Button_error__1gR1K`


### 增加SASS 样式

`npm install node-sass --save`

文件会被自动编译的，如果被引入的文件明拓展是`.scss`或者`.sass`

sass还是可以自定义变量，使用@import 来引入文件

### post-processing CSS

自动添加浏览器前缀

#### 添加图像，字体和文件

使用 import 引入 .bmp  .gif  .jpeg  .png ，大小小于10000字节的图像将返回数据uri,

svg 文件可以直接被导入作为React组件。
```
import { ReactComponent as Logo } from './logo.svg';
const App = () => (
  <div>
    {/* Logo is an actual React component */}
    <Logo />
  </div>
);
```

### 使用public 文件夹

可以修改publick文件夹下的html文件，比如设置页面标题，`<script>`标签在打包的程序中会自动生成并添加到代码中。

使用 import的好处：

1. script和stylesheets被缩小和打包来减少额外的网络请求
2. 缺少文件会导致编译错误，而不是4040错误
3. 结果文件名包含内容哈希，因此您无需担心浏览器缓存旧版本

public文件下的内容不会被webpack打包的，public文件夹下的资源是会被复制到构建文件夹中的，要引用public文件夹中的资源，需要使用一个名为的特殊变量PUBLIC_URL

`<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">`

当运行时npm run build，Create React App将替换%PUBLIC_URL%为正确的绝对路径
**什么时候使用public文件夹**

1. 您需要在构建输出中具有特定名称的文件，例如manifest.webmanifest *（原因可能是：webpack对它无法打包）*
2. 您有数千个图像，需要动态引入他们的路径  *（原因可能是：减少import带来的编译成本）*
3. 希望在打包代码中包含一个小的脚本
4. 有一些库可能和webpack有冲突，你没有别的选择只能用`script`标签引入

如果使用`script` 标签引入的话，是全局变量

### 代码拆分

`import()`动态引入，进行代码分割。import()函数的形式将模块名称作为参数并返回一个Promise总是解析为模块的名称空间对象的形式。
**使用react路由进行代码拆分**  [!https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html]

## 构建你的App

### 安装依赖

生成的项目包括react和react dom 作为依赖，它还包括create-react-app 用作开发依赖项的椅子脚本。它还需要安装其他依赖：

```js
npm install --save react-router-dom
```

### 导入组件

由于Webpack，该项目设置支持ES6模块。
虽然你仍然可以使用require()和module.exports，我们鼓励您使用import和export替代。

一个文件最多只有一个默认导出和许多有名的exports

### 使用全局变量

可以通过从window对象中显式读取全局变量来避免linter警告，因为 linter看不到变量的定义

``` js
const $ = window.$;
```

### 增加Bootstrap

`npm install --save reactstrap bootstrap@4`

在`src/index.js`文件开头引入bootstrap css文件，和可选的bootstrap 主题

`import 'bootstrap/dist/css/bootstrap.css';`

在`src/App.js`文件活自定义文件中导入所需的reactstrap 组件

`import { Button } from 'reactstrap';`

### 增加Flow

`npm install --save flow-bin`

它是分析打包之后的包中各个模块的体积大小的