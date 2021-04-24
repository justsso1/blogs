

npm 的核心目标：

> Bring the best of open source to you, your team and your company.
给你和你的团队、你的公司带来最好的开源库和依赖。

## npm install 的安装机制和背后思想

![npm 安装机制](../imgs/npm/npm安装机制.png)

npm install 执行之后，首先，检查并获取 npm 配置，**这里的优先级为：项目级的 .npmrc 文件 > 用户级的 .npmrc 文件> 全局级的 .npmrc 文件 > npm 内置的 .npmrc 文件。**

## npm 缓存机制


## node.js 包查找机制

