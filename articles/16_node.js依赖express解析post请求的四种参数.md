分别是这四种:

www-form-urlencoded,

form-data,

application/json,

text/xml

www-form-urlencoded
这是http的post请求默认的数据格式，需要body-parser中间件的支持
服务器端的demo：
复制代码
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.post('/urlencoded', function(req, res){
    console.log(req.body);
    res.send(" post successfully!");
});
app.listen(3000);
复制代码
可以用postman进行测试，这里就不赘述。

form-data
这种方式一般用于数据上传，需要中间件connect-multiparty的支持
服务器端的demo:
复制代码
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.post('/formdata',multipartMiddleware, function (req, res) {
  console.log(req.body);
  res.send("post successfully!");
});
复制代码
application/json
body-parser中间件支持json解析, 添加中间件进行解析即可
app.use(bodyParser.json());
text/xml
body-parser默认不支持这种数据格式
解决方法：把请求体参数按照字符串读取出来,然后使用 xml2json 包把字符串解析成json对象，然后对json对象进行操作，方便得多。
注意：我们还是要使用 body-parse 得到字符串,然后再转化.
利用req上定义的事件 data 来获取http请求流, end 事件结束请求流的处理.
利用 xml2json 把上面得到的请求参数流(我们直接转化为字符串)转化为 json 对象.
demo如下：
复制代码
var express = require('express');
var bodyParser = require('body-parser');
var xml2json=require('xml2json');
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.post('/xml', function (req, res) {
  req.rawBody = '';//添加接收变量
  var json={};
  req.setEncoding('utf8');
  req.on('data', function(chunk) { 
    req.rawBody += chunk;
  });
  req.on('end', function() {
  json=xml2json.toJson(req.rawBody);
  res.send(JSON.stringify(json));
  }); 
});
app.listen(3000);
