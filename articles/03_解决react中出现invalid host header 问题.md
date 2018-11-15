# 解决react中出现invalid host header问题

这是我在使用react框架开发中遇到的问题。

我本地的127.0.0.1或者localhost需要一个代理域名，否则无法向服务器请求访问。因为微信的js-sdk使用时，前台的域名必须是合法的【需要配置的白名单里面，白名单的检查方式是只检查域名】,所以需要配host,将 127.0.0.1 配到rockcms.ibt.tel

解决方法：在config文件夹下的webpackDevServer.config.js 中，将disableHostCheck 的值改为 true
