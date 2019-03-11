自动安装就好了；配置文件目录在/etc/nginx 下；启动命令为 /usr/sbin/nginx ;



现在开始配置文件了； 我们进入 /etc/nginx/conf.d 目录下，创建一个文件 myWeb.conf,文件要以.conf结尾，这样启动nginx时，能够自动加载这个配置文件；



server {

listen 8080;

server_name .*.com;

root /home/work/***/static/client;

index index.html;

autoindex on;

charset utf-8;



​
1
location ~ /(system|car)/ {
2
    proxy_set_header Host $host;
3
    proxy_set_header X-Real-IP $remote_addr;
4
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
5
    proxy_pass http://192.168.1.1:8851;
6
}
7
​
8
#配置Nginx动静分离，定义的静态页面直接从Nginx发布目录读取。
9
location /admin {
10
    alias /home/work/****/static/admin/;
11
    #expires定义用户浏览器缓存的时间为7天，如果静态页面不常更新，可以设置更长，这样可以节省带宽和缓解服务器的压力
12
    expires  1d;
13
    index index.html;
14
autoindex on;
15
}
16
​
17
access_log /home/work/****/logs/static_admin_ng_access.log;
18
​
19
location /api/ {
20
    proxy_set_header Host $host;
21
    proxy_set_header X-Real-IP $remote_addr;
22
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
23
    proxy_pass http://192.168.1.1:8851;
24
}
25
#配置Nginx动静分离，定义的静态页面直接从Nginx发布目录读取。
26
location /client {
27
    alias /home/work/****/static/client/;
28
    #expires定义用户浏览器缓存的时间为7天，如果静态页面不常更新，可以设置更长，这样可以节省带宽和缓解服>务器的压力
29
    expires  1d;
30
    index index.html;
31
autoindex on;
32
}
33
access_log /home/work/****/logs/static_client_ng_access.log;
​


}



在配置这个的时候，遇到一个坑，就是alias 和root 的区别，导致获取的静态文件的获取的路径不对，一直报404；郁闷的很；



在配置ng 的location 的生活；一般不要加后面的斜杆；然后加上autoindex on; 自动首页；这样就会自动跳转到首页了；



alias 和 root 的区别； root 的话；location 中的地址会拼接到root后面；alias就直接代替后面的东西



如：

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



访问地址：localhost:8080/admin/res/app.js;



root实际访问的地址就是： localhost:8080/admin/res/admin/res/app.js



也就是说这个实际访问的地址 ./admin/res/admin/res/app.js ；这样根本找不到文件；



alias 实际的访问地址就是： localhost:8080/admin/res/app.js;



访问的地址是  ./admin/res/app.js



location /admin/{

root  /admin/res/;

index html.html;

autoindex no;

}

上面这种配置 localhost:8080/admin  是不能跳转到首页的；

需要加上斜杆 localhost:8080/admin/  才能跳转到首页



location /admin{

root  /admin/res/;

index html.html;

autoindex no;

}



这种访问的时候： localhost:8080/admin  这样就可以直接访问了；



配置服务器代理：



location /api/ {

proxy_set_header Host $host;

proxy_set_header X-Real-IP $remote_addr;

proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

proxy_pass http://192.168.1.1:8851;

}

一定要填写

​
1
proxy_set_header Host $host;
2
    proxy_set_header X-Real-IP $remote_addr;
3
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
4
    proxy_pass http://192.168.1.1:8851;
​
这4项了； 现在这样访问的地址就是  http://192.168.1.1:8851/api/...........;

为了配置这个折腾了一天，安装-配置-调试；弄了将近一天的时间；

原文：https://blog.csdn.net/chenhuaping007/article/details/79997901
