---
2020.4.22
---

let 和const命令是ES6新增的，让我们来看看它们是怎么回事吧～

在有 let 和const之前，我们使用 var 来声明变量，var声明变量会有变量提升的特性，

Javascript
console.log(a)
var a = 1 //undefined
用var声明a,a变量会被提升到在当前作用域的最前面声明，其实执行的代码是这样的：

Javascript
var a;
console.log(a)
a = 1;
为了约束变量提升，出现了块级作用域，块级作用域搭配let和const就没有变量提升了。

Javascript
console.log(b)
let b = 1 //ReferenceError: b is not defined
用let就没有变量提升的问题，但是在声明变量之前就访问，会报错，访问b会报ReferenceError错误
那let为什么没有变量提升的问题呢？块级作用域又是什么呢？

块级作用域
let和const实际上为ES6引入了”块级作用域”的概念。
在ES5中只有全局作用域和函数作用域。ES6新增了块级作用域来约束变量的生命周期。
简单说就是两个大括号{}就形成了块级作用域，外层代码块不受内层代码块的影响。

```Javascript
function f1(){
    let n = 5;
    if(true){
        let n = 10
    }
    console.log(n) //5
}



for(let i =0 ;i< 10 ;i++){

}
console.log(i)  //ReferenceError: i is not defined
```


内层的n不会影响外层的n，所以打印n=5
for循环中声明了变量i,在for循环之外访问i变量，会报错，这是因为在外层代码块中没有声明变量i

for循环中都会有块级作用域。我们来看一个经典的例子

```Javascript
var arr = []
for (var i = 0; i < 10; i++) {
    arr[i] = function () {
        console.log(i)
    }
}

arr[2]() //10
console.log(i) //10
```

在for循环外可以访问到i，i的值为10，这是因为i在for循环中使用var声明了，会被变量提升，结果就是i挂载到全局对象中，
在浏览器中就是window对象，成为window的属性。每一层循环改变的都是全局的i, 传入到循环中的console.log(i)都是10，
最后外部访问的i值也变成了10

```Javascript
var brr = []
for (let i = 0; i < 10; i++) {
    brr[i] = function () {
        console.log(i)
    }
}

brr[2]() //2
console.log(i) //ReferenceError: i is not defined
```
for循环中使用let声明变量i，这样每一层循环都重新声明了i，并绑定了当前循环的代码块，所以传入内存函数的额console.log(i)
也是当时的i的值，所以brr[2]()执行时，变量i的值是2，在for循环外访问i会出错。

你可能会问，每一层的循环变量都是重新声明的，那么for循环怎么知道上一层循环的值，从而计算出本层的值？这是因为
Javascript引擎内部会记住上一层的循环的值，在上一层循环的基础上，计算得出初始化本层的变量的值。

细说for循环中的块级作用域
for循环中（）是一个块级作用域，而循环体内{}是一个单独的子作用域。

```Javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc

```

上面输出三次 abc ，说明，循环内部的i变量与循环变量i不在同一个作用域，有各自单独的作用域。

我们来看看let到底是怎么由var转过来的，我用Babel试试：

```Javascript
var brr = []
for (let i = 0; i < 10; i++) {
    brr[i] = function () {
        console.log(i)
    }
}

brr[2]()
console.log(i)

```

Babel转过之后，

```Javascript
"use strict";

var brr = [];

var _loop = function _loop(_i) {
    brr[_i] = function () {
        console.log(_i);
    };
};

for (var _i = 0; _i < 10; _i++) {
    _loop(_i);
}

brr[2]();
console.log(i);
```

babel把for循环内层都抽象到一个函数中了，然后，把循环变量传入这个函数参数，这样每一层的循环都会返回一个函数声明，
而循环变量都会锁定住。

暂时性死区
只要块级作用域中有let和const命令，那么所声明的变量就”绑定”这个区域，不再受外部的影响。
在块级作用域内，使用let或const声明变量之前，该变量都是不可取的，这就叫”暂时性死区”

暂时性死区解决的问题：
解决了在声明变量之前访问该变量，没有变量提升，主要为了减少运行时错误。

暂时性死区的本质：

只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，不可访问，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

## const
### 基本用法
const声明一个只读的常量。一旦声明，常量的值就不能改变。

- const 也不会变量提升
- const 也存在暂时性死区特性
- const在声明变量时就要赋值，否则以后不能赋值了
- const只声明不赋值会报错


const 声明的变量如果是基本类型，那么不允许改变，如果是引用类型，那么只要不改变引用的地址就是可以的。

### 本质
Javascript
const name = 'Friday'
name = 'Sunday'  //直接报错

const people = {
    name: 'Jack',
    age: 21
}
people.age = 22
console.log(people) //{ name: 'Jack', age: 22 }