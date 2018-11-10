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
### Style and Assets

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



