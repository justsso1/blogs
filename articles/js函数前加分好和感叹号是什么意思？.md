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

但是下面这个代码可以的

```javascript
(function a(){alert('iifksp')})()
```



但是括号则不同，它将一个函数声明转化成了一个表达式，解析器不再以函数声明的方式处理函数a，而是作为一个函数表达式处理，也因此只有在程序执行到函数a时它才能被访问。

所以，**任何消除函数声明和函数表达式间歧义的方法，都可以被解析器正确识别**。所以包括！

！会使用js函数解析为一个表达式，解析器可以分析。

jkh 