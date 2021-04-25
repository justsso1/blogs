---
2020.3.12
---

cookie session jwt token
cookie 和session 结合认证
token 认证
jwt 认证
扫码认证
Oauth2 认证
单点登录
LDAP 认证
cookie 、session
重点：

在父域名下设置cookie，在他的二级子域名可以获取到，这样可以共享cookie
cookie 应该设置httponly属性 ,防止跨站攻击XSS
readonly
问题：

在于后台要存储session数据，数据量过大会是一种问题，如果用负载均衡，一旦那个负责session的机器挂了，就会出现问题，所有人的登录态就失效了
JWT认证、Token认证
JWT 全称是JSON Web Token，一种无状态的认证方式。

JWT解决的不是数据传输安全
JWT解决的是服务端cookie 、session存储，这种前后端有状态的问题
常用的Token和JWT认证是有一定差别的
JWT和Token有一定的差别，JWT适合一次性验证，比方邮件激活，Token适合我们一般的API请求。

常见流程
用户发起请求登录，服务端验证后，通过JWT生成一个Token，并返回给前端
前端存储起来，一般存在sessionStorage中
后续API请求都带上这个Token，服务端通过这个Token来验明身份
Token有一个时效性，过了时间需要重新获取，所以一般前端会在Ajax的请求做个统一的intreceptors
组成
Javascript
Header.Payload.Signature
Header

Javascript
{
  "alg": "HS256"， // 标记签名的算法
  "typ": "JWT"
}
Payload

Javascript

{
  "sub": "1234567890"， //  payload 这里是存我们的方存放的用户信息
  "name": "John Doe"，
  "admin": false，
  exp: number // 过期时间
  // ......
}
Signature签名：
密钥好好保存，伪代码展示：

Javascript
const signature = HMACSHA256(
    base64UrlEncode(Header)+"."+base64UrlEncode(Plyload)+"."+ secret
);
res.send({signature: signature})
因为 Header、Payload 实际是个 Base64 过的，所以拿到后经过 Base64 解码后是可以看到实际内容的，所以隐私数据不要放在 Payload 里，Payload 存放用户的基本信息，userId、userName、mail 啥的。

通常我么恩在调用后端API的时候，都只有一个常常的字符串，没有见到这个x.x.x的三段式阿？

这是因为我们在客户端存储的事Token，即上文说的Signature

对于 API 请求 Header 这个其实是多余的，只要我的 Token 能唯一标记是哪个用户就可以，也不需要验签这个流程的，我只需要在 Redis 存储用户 和 Token 的关系就好，所以 JWT 和 Token 的差别是，JWT 不需要在后端存储用户和 Signature 的关系，只需要做个验签就可以
所以 JWT 适合做一次行验证，比方邮箱激活账号，Token 适合做 API 请求认证。

2 者的差别就是 Token 需要服务端存储 Token 和用户的关系，JWT 不需要，这二者对于前端开发者来说，在调用方式上没有差别。

安全性相关

缩短 Token 有效时间
secret 定时替换
使用 HTTPS 加密协议
对标准字段 iss、sub、aud、nbf、exp 进行校验
参考：https://www.jianshu.com/p/8f7009456abc

OAuth2 认证
第三方登录


