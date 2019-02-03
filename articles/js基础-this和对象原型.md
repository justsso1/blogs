# js基础-this和对象原型

## 认识this

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

打印和我们预期的不一样，为什么foo.count还是0呢？为了达到一样，我们可以这样做：

1.函数标示符替代this来引用函数对象

>函数分为具名函数和匿名函数，具名函数中，函数名可以指向this,但是匿名函数就找不到名称指向this.

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

2.强制this指向函数，使用call()函数,把函数标示符传入。

``` js
function foo(num) {
    console.log('foo:', num);
    this.count++
}

foo.count = 0;

for (var i = 0; i < 10; i++) {
    if (i > 5) {
        foo.call(foo, i)
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

但是上面的两种方法都避免了使用this。我们之前说了，this提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将API设计的更加简洁并且易于复用。函数可以自动引用合适的上下文对象是非常重要的。

所以我们认识一下this.


**注意**：this在任何时候都不等于函数的作用域。在js内容，作用域确实和对象类似，可见的标示符都是它的属性。但是作用域“对象”无法通过js代码访问（也就是作用域只和词法作用域有关于，而和运行时是无关的）， 它存在与javascript引擎内。

this 和作用域是不可以混合的,this既不指向自身，也不指向函数的词法作用域。this实际上是在函数被调用的时候发生的绑定，它指向什么完全取决于函数在哪里被调用。

> this 是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。

> 当一个函数被调用时，会创建一个活动记录(有时候也称为执行上下文)。这个记录会包 含函数在哪里被调用(调用栈)、函数的调用方法、传入的参数等信息。this 就是记录的 其中一个属性，会在函数执行的过程中用到

## 解析this

this完全取决于函数调用的位置。那找到调用位置了，就离this更进一步了。
所以，调用位置是什么呢？是函数被调用的位置？没那么简单，因为有些编程会隐藏函数的真正的调用位置。

先来看个例子；

```js
function baz() {
    console.log('baz');
    bar();
}

function bar() {
    console.log('bar');
    foo();
}

function foo() {
    debugger;
    console.log('foo');
}

baz();
```

控制台的截图：

![debugger截图](../imgs/this/1-this调用堆栈.png)

Call Stack是调用堆栈

栈结构是先入后出，后入先出的。

栈的第二位是函数的调用位置。

栈里面存的是调用堆栈。

## this的绑定规则

**this的几种绑定规则**

1 默认绑定，运行在非严格模式下，this绑定window,运行在严格模式下，this是undefined

2 隐式绑定
函数在调用的时候，被一些上下文对象拥有，这么说也不太准确

```js
function foo() {
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo
};
obj.foo();
//打印： 2
```

函数的上下文对象和它的最高层调用有关系

```js
function foo() {
    console.log(this.a)
}

var obj1 = {
    a: 2,
    obj2: obj2
};
var obj2 = {
    a: '3',
    foo: foo
};

console.log(obj1.obj2); //undefined

obj1.obj2.foo();  //Cannot read property 'foo' of undefined
```

```js
//会产生错误的写法
function foo() {
    console.log(this.a)
}

var obj2 = {
    a: '3',
    foo: foo
};

var obj1 = {
    a: 2,
    obj2: obj2
};

console.log(obj1.obj2); //undefined

obj1.obj2.foo();  //Cannot read property 'foo' of undefined
```

2.
- 隐式丢失
// 隐式绑定中最容易出现的问题是，this丢失绑定的上下文对象.从而变成默认绑定，this指向window或者undefined

```js
function foo() {
    console.log(this.a)
}

function doFun(fn) {
    fn()
}

var obj = {
    a: 2,
    foo: foo
};

var a = '我是window的a';
doFun(obj.foo);

//打印： 我是window的a
```

3. 为了解决绑定丢失的问题，有了显示绑定， bind() ES5内置了，不过也可以手动实现这个函数

//传入的参数，最终返回一个函数

// 函数的[[原型]]可以解决这个问题。JavaScript提供的大部分函数以及我们创建的自定义函数，都可以实用apply()和call()函数。
//他们的第一个参数是一个对象，他们会把这个对象绑定到this上面，接着在调用函数时，指定这个this.
//从this的绑定角度，apply()和call()的效果是一样的，只是参与的传入不一样。

//Es5提供了硬绑定的函数在Function.prototype中  bind()

//---3-2 api调用上下文

```js
function foo(item) {
    console.log(this.id, item)
}

var obj = {
    id: 'aseome'
};

[1, 2, 3].forEach(foo, obj);

// aseome 1
// aseome 2
// aseome 3

```

4.new绑定

并不存在构造函数，只是存在

```js
function foo(a) {
    this.a = a;
}

var bar = new foo(2);
console.log(bar);
console.log(bar.a);

//打印
//foo {a: 2}
// a: 2
// __proto__: Object
// this.js:213 2

```

## this规则的优先级

//1。 new绑定

//2。 显示绑定 call() apply()高于隐式绑定的，也就是隐式绑定一个上下文对象

//硬绑定 bind() 会创建一个新的包装函数

//3。 隐式绑定

//4。 最后的是默认绑定了，this是window或者undefined

//--- 手动实现bind()函数，在一些古老的浏览器中没有Function.prototype没有bind函数
```js
function bind() {
    // console.log(typeof Function.prototype.bind);
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            // if (typeof this !== 'function') {
            //     throw new Error('这不是一个函数')
            // }
            console.log(typeof this);
        }
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {
        },
        fBind = function () {
            return fToBind.apply(
                (this instanceof fNOP && oThis ? this : oThis),
                aArgs.concat(
                    Array.prototype.slice.call(arguments)
                )
            )
        }
    ;
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

}


// bind(2);
```

console.log(Array.prototype);
console.log(Number.prototype);
console.log(Function.prototype);

## 对象

在javascript中一共有7种a语言类型

- string
- number
- boolean
- undefined
- null
- object
- symbol

简单基本类型有6中，string number boolean undefined null symbol,他们不是对象

实际上，JavaScript 中有许多特殊的**对象子类型**，我们可以称之为复杂基本类型。
**内置对象**

String Number Boolean Object Function Array Data RegExp Error .在js

插曲：

```js
var myObject = {};
myObject.toString()
"[object Object]
```

可计算属性。[]符号内部存放表达式，[]和es6中的symbol结合的比较多。

属性和方法

从技术角度来说，函数永远不会“属于”一个对象。
无论返回值是什么类型，每次访问对象，都叫做属性访问。