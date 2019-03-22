# js函数前加分好和感叹号是什么意思

```javascript
function a(){alert('iifksp')} 
```

没有加！之前，a是函数声明，只能a( )的方式调用。

而如果以下面的方式调用，就会报错：

```javascript
function a(){alert('iifksp')}()  //Uncaught SyntaxError: Unexpected token )
```

因为这样的代码混淆了函数声明和函数调用，以这种方式声明的函数 `a`，就应该以 `a();` 的方式调用。

！会使用js函数解析为一个表达式，解析器可以分析