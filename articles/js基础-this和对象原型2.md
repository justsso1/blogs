# js基础-this和对象原型

## [[Prototype]]

JavaScript中的**对象**有一个特殊的[[Prototype]]内置属性，其实就是对于其他对象的引用。几乎所有对象在创建时[[Prototype]]属性都会被赋予一个非空值。

### 对象的[[Prototype]]链

```js
var anotherObject = { a:2
};
// 创建一个关联到 anotherObject 的对象
var myObject = Object.create( anotherObject ); myObject.a; // 2
```

>Object.create(..) 的原理.
创建一个 对象并把这个对象的 [[Prototype]] 关联到指定的对象

使用 for..in 遍历对象时原理和查找 [[Prototype]] 链类似，任何可以通过原型链访问到 (并且是 enumerable，参见第 3 章)的属性都会被枚举。使用 in 操作符来检查属性在对象
中是否存在时，同样会查找对象的整条原型链(无论属性是否可枚举)

通过各种语法进行属性查找时都会查找 [[Prototype]] 链，直到找到属性或者
查找完整条原型链

### Object.prototype

所有普通的 [[Prototype]] 链最终都会指向内置的 Object.prototype

Object.prototype包涵很多

## “类”

JavaScript中只有对象，没有类。

### “类”函数

所有的**函数**默认都会拥有一个 名为 prototype 的公有并且不可枚举(参见第 3 章)的属性，它会指向另一个对象

```js
function Foo() { // ...
}
Foo.prototype; // { }
```

## （原型）继承


如果要访问对象中并不存在的一个属性，[[Get]] 操作(参见第 3 章)就会查找对象内部
[[Prototype]] 关联的对象。这个关联关系实际上定义了一条“原型链”(有点像嵌套的作用域链)，在查找属性时会对它进行遍历。
所有普通对象都有内置的 Object.prototype，指向原型链的顶端(比如说全局作用域)，如 果在原型链中找不到指定的属性就会停止。toString()、valueOf() 和其他一些通用的功能 都存在于 Object.prototype 对象上，因此语言中所有的对象都可以使用它们。
关联两个对象最常用的方法是使用 new 关键词进行函数调用，在调用的 4 个步骤(第 2 章)中会创建一个关联其他对象的新对象。
使用 new 调用函数时会把新对象的 .prototype 属性关联到“其他对象”。带 new 的函数调用 通常被称为“构造函数调用”，尽管它们实际上和传统面向类语言中的类构造函数不一样。
虽然这些 JavaScript 机制和传统面向类语言中的“类初始化”和“类继承”很相似，但 是 JavaScript 中的机制有一个核心区别，那就是不会进行复制，对象之间是通过内部的 [[Prototype]] 链关联的。
出于各种原因，以“继承”结尾的术语(包括“原型继承”)和其他面向对象的术语都无 法帮助你理解 JavaScript 的真实机制(不仅仅是限制我们的思维模式)