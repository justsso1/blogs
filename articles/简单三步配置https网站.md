# 简单三步配置https网站

#### 第一步：申请SSL证书

ssl证书是一种加密协议。大部分企业级的SSL证书都是需要收费的，个人使用的SSL证书，有一些是免费的。像阿里云、腾讯云都有提供免费证书申请的接口。

我采用得是阿里云，登陆阿里云账号之后，在 **阿里云》控制台》我的云产品》SSL证书(应用安全)**下，进入该页面。

1. 点击购买证书按钮
2. 选择免费型 DV SSL
3. 填写个人信息，配置域名信息
4. 配置域名授权验证

做完以上步骤，就会发现在域名的dns解析下面多了一条txt记录。证书的状态变成**已签发**之后，就可以把证书下载到本地。

#### 第二步：配置nginx服务器

我的服务器是nginx ，所以本文提供的是nginx 的配置方法。把下载下来的证书(包括 .pem文件和 .key文件)上传到服务器nginx安装的位置，一般是在 `/etc/nginx`下，我放在`ssl`目录下。

#### 第三步：修改配置文件，重启nginx

```bash
server {

        listen 80;
        server_name xxx.com;

        root /home/xxx;

        index index.html index.htm index.nginx-debian.html;
        
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        #rewrite ^(.*)$ http://$host$1 permanent;

        location / {
                root /;
                proxy_pass http://localhost:3003;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
		client_max_body_size 1000m;
#               try_files $uri $uri/ =404;		
        }
}
server {

        listen 443 ssl;
        server_name xxx.com;
        ssl on;

        root /home/xxx;
        index index.html index.htm index.nginx-debian.html;    

        ssl_certificate   ssl/2353222_wordcamp.ibt.tel.pem;
        ssl_certificate_key  ssl/2353222_wordcamp.ibt.tel.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;


        location / {
                root /;
                proxy_pass http://localhost:3003;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
 #               try_files $uri $uri/ =404;
        }
} 
```

保存配置文件后，重启Nginx：`nginx -s reload`。

之后就可以使用`https`访问我们的网址了。

