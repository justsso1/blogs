# nnginx-ubuntu系统安装nginx

参考博客：

- linux环境下安装nginx步骤[https://www.cnblogs.com/wyd168/p/6636529.html](https://www.cnblogs.com/wyd168/p/6636529.html)
- 使用Nginx搭建WEB服务器[https://www.linuxidc.com/Linux/2013-09/89768.htm](https://www.linuxidc.com/Linux/2013-09/89768.htm)
- 网站部署发布到互联网等整套流程 （很全的）[https://blog.csdn.net/shuai7boy/article/details/53203339](https://blog.csdn.net/shuai7boy/article/details/53203339)
- （逻辑清晰）如何在 Ubuntu 上使用 pm2 和 Nginx 部署 Node.js 应用 [https://linux.cn/article-8494-1.html](https://linux.cn/article-8494-1.html)

我的nginx安装目录  /usr/local/nginx/sbin/nginx

## 一. 安装包安装

1. 安装Nginx

```shell
$sudo apt-get install nginx
```

Ubuntu安装之后的文件结构大致为：

所有的配置文件都在/etc/nginx下，并且每个虚拟主机已经安排在了`/etc/nginx/sites-available`下
程序文件在`/usr/share/nginx/html`
日志放在了`/var/log/nginx`中
并已经在`/etc/init.d/`下创建了启动脚本`nginx`
默认的虚拟主机的目录设置在了`/var/www/nginx-default` (有的版本 默认的虚拟主机的目录设置在了`/var/www`, 请参考`/etc/nginx/sites-available`里的配置)

2. 启动Nginx

```shell
$sudo /etc/init.d/nginx start
```

然后就可以访问了，http://localhost/ ， 一切正常！

启动时候若显示端口80被占用：

 `Starting nginx: [emerg]: bind() to 0.0.0.0:80 failed (98: Address already in use)`，

修改文件：`/etc/nginx/sites-available/default`,去掉 `listen` 前面的 `#` 号 ,` # `号在该文件里是注释的意思 , 并且把 `listen` 后面的 `80` 端口号改为自己的端口，访问时需要添加端口号。（安装完后如出现403错误，那可能是nginx配置文件里的网站路径不正确）

链接：[cd](https://www.jianshu.com/p/7cb1a824333e)