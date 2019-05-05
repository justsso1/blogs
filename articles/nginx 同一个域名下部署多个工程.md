# nginx 配置：同一域名下部署多个项目

`nginx`自动安装就好了；配置文件目录在`/etc/nginx` 下；启动命令为 `/usr/sbin/nginx `;

现在开始配置文件了； 我们进入 `/etc/nginx/conf.d`目录下，创建一个文件 myWeb.conf,文件要以.conf结尾，这样启动nginx时，能够自动加载这个配置文件；

```shell
server {
	listen 8080;
	server_name .*.com;
	root /home/work/***/static/client;
	index index.html;
	autoindex on;
	charset utf-8;
	
  location ~ /(system|car)/ {
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass http://192.168.1.1:8851;
  }

	location /admin {
      alias /home/work/****/static/admin/;
      expires  1d; #expires定义用户浏览器缓存的时间为7天，如果静态页面不常更新，可以设置更长，这样可以节省带宽和缓解服务器的压力
      index index.html;
      autoindex on;
	}
	access_log /home/work/****/logs/static_admin_ng_access.log;
  
  location /api/ {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://192.168.1.1:8851;
  }
    
    location /client {
        alias /home/work/****/static/client/;
        expires  1d; #expires定义用户浏览器缓存的时间为7天，如果静态页面不常更新，可以设置更长，这样可以节省带宽和缓解服>务器的压力
        index index.html;
        autoindex on;
    }
		access_log /home/work/****/logs/static_client_ng_access.log;
}

```

在配置这个的时候，遇到一个坑，就是**alias** 和**root** 的区别，导致获取的静态文件的获取的路径不对，一直报404；郁闷的很。

在配置nginx 的location 的时候；一般不要加后面的斜杠；然后加上`autoindex on`; 自动首页；这样就会自动跳转到首页了；

**alias** 和 **root** 的区别:

**root** 的话，location 中的地址会拼接到root后面

**alias**就直接代替后面的东西

如：

```shell
location /admin {
  root  /admin/res/;
  index html.html;
  autoindex no;
}

location /admin {
  alias /admin/res/;
  index html.html;
  autoindex no;
}
```

访问地址：`localhost:8080/admin/res/app.js`

**root**实际访问的地址就是：`localhost:8080/admin/res/admin/res/app.js`

也就是说这个实际访问的地址 `./admin/res/admin/res/app.js `；这样根本找不到文件；

**alias** 实际的访问地址就是： `localhost:8080/admin/res/app.js;`

访问的地址是  ./admin/res/app.js

```shell
location /admin/{

  root  /admin/res/;

  index html.html;

  autoindex no;

}
```

上面这种配置 localhost:8080/admin  是不能跳转到首页的；

需要加上斜杆 localhost:8080/admin/  才能跳转到首页

```shell
location /admin{
	root  /admin/res/;
	index html.html;
	autoindex no;
}
```

这种访问的时候： localhost:8080/admin  这样就可以直接访问了；

配置服务器代理：

```shell
location /api/ {

proxy_set_header Host $host;

proxy_set_header X-Real-IP $remote_addr;

proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

proxy_pass http://192.168.1.1:8851;

}
```

一定要填写

`proxy_set_header Host $host;`
` proxy_set_header X-Real-IP $remote_addr;`
`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`
`proxy_pass http://192.168.1.1:8851;`
​
这4项了； 现在这样访问的地址就是  http://192.168.1.1:8851/api/...........;

为了配置这个折腾了一天，安装-配置-调试；弄了将近一天的时间；

原文：https://blog.csdn.net/chenhuaping007/article/details/79997901

