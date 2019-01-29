# js基础-this和对象原型

## 关于this

this是一个关键字，被自动定义在所有函数的作用域中。
this提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将API设计的更加简洁并且易于复用。

函数可以自动引用合适的上下文对象是非常重要的。

``` js
function foo(num) {
    console.log('foo:', num);
    this.count++;
    console.log(this)   //window对象
}

foo.count = 0;

for (var i = 0; i < 10; i++) {
    if (i > 5) {
        foo(i)
    }
}

console.log(foo.count); //0

//所有打印
//foo: 6
//foo: 7
//foo: 8
//foo: 9
//0
```

打印和我们预期的不一样，为了达到一样，我们可以这样做：
1.函数标示符替代this来引用函数对象

函数分为具名函数和匿名函数，具名函数中，函数名可以指向this,但是匿名函数就找不到名称指向this.

修改代码:

```js
function foo(num) {
    console.log('foo:', num);
    foo.count++
}

foo.count = 0;

for (var i = 0; i < 10; i++) {
    if (i > 5) {
        foo(i)
    }
}

console.log(foo.count);

//所有打印
// foo: 6
// foo: 7
// foo: 8
// foo: 9
// 4
```

强制this指向函数，使用call()函数

**注意**：this在任何时候都不等于函数的作用域。在js内容，作用域确实和对象类似，可见的标示符都是它的属性。但是作用域“对象”无法通过js代码访问（也就是作用域只和词法作用域有关于，而和运行时是无关的）， 它存在与javascript引擎内。