
普通函数中this的绑定是很复杂多变的，ES6箭头函数=>以特定的方式改变this的行为特性，解决this相关编码的
一个特殊又常见的痛点。

箭头函数也不总是比普通函数好，当这个函数越长，=>带来的好处越小，这个函数越短，=>带来的好处越大。所以
只在确实需要简短的在线函数表达式的时候才用=>，而对于那些一般长度的函数则无需改变。

```Javascript
var controller = { 
     makeRequest: function(){ 
     var self = this; 
     btn.addEventListener( "click", function(){ 
        // .. 
            self.makeRequest(); 
        }, false ); 
     } 
};
```

在这个例子中，我们使用var self = this这一Hack，然后使用self.makeRequest，因为我们传入addEVentListener的回调函数内部，this绑定和
makeRequest()本身的this绑定不一样。普通函数中的this绑定是动态的，我们需要通过self变量依赖词法作用域的可预测性。

箭头函数中的this绑定不是动态的，而是词法的。

```Javascript
var controller = { 
     makeRequest: function(){ 
         btn.addEventListener( "click", () => { 
             // .. 
            this.makeRequest(); 
         }, false ); 
     } 
};

```

我们使用`=>`箭头函数替代普通函数，箭头函数回调中的词法`this`和`makeRequest()`中是一样的。=>就是var self = this的词法替代形式。

我们使用Babel转换一下：
![](http://cdn.hixiaoya.com/blogs/imgs/es6/%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0.png)

发现，在使用=>之前，也就是箭头函数的外层，先使用var self = this保存了this

再看一个例子：

```Javascript
var controller = { 
     makeRequest: () => { 
         // .. 
        this.helper(); 
     }, 
     helper: () => { 
         // .. 
     } 
}; 
controller.makeRequest();
```

尽管我们以 controller.makeRequest(..) 的形式调用，this.helper 引用还是会失败，因为
这里的 this 并不像平常一样指向 controller。那么它指向哪里呢？它是从包围的作用域中
词法继承而来的 this。在前面的代码中也就是全局作用域，其中 this 指向那个全局对象。

- 箭头函数没有自己的this，只有词法this，继承自父层
- 箭头函数没有自己的arguments数组，只有词法arguments，继承自父层
- 箭头函数也没有super
- 箭头函数也没有new.target

作用域和作用域链

一定要记住箭头函数的特点，在适当的地方使用。
如果是写对象的方法，要使用普通函数，因为普通函数中有this，一般情况下指向该对象，而箭头函数没有this,则访问不到对象的其他属性了。

如果返回值是一个简单的表达式，且这个函数内部没有this的引用，且没有自身引用（递归、绑定/解绑定，且不会要求函数执行这些，可以使用箭头函数。

如果函数内部有很多语句，还是要用普通函数，保证可读性。

