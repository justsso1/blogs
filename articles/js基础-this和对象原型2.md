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

Object.prototype包涵很多通用的功能：`toString()` 和 `.valueOf()` `.hasOwnProperty(..)`。

### 属性设置和屏蔽

给一个对象设置属性的过程。

`myObject.foo = 'aa';`

如果属性名 foo 既出现在 myObject 中也出现在 myObject 的 [[Prototype]] 链上层，那 么就会发生**屏蔽**。myObject 中包含的 foo 属性会屏蔽原型链上层的所有 foo 属性，因为 myObject.foo 总是会选择原型链中最底层的 foo 属性。

屏蔽比我们想象的更复杂。

下面我们分析一下如果 foo 不直接存在于 myObject 中而是存在于原型链上层时 myObject.foo = "bar" 会出现的三种情况。

1. 如果在[[Prototype]]链上层存在名为foo的普通数据访问属性(参见第3章)并且没 有被标记为只读(writable:false)，那就会直接在 myObject 中添加一个名为 foo 的新 属性，它是屏蔽属性。
2. 如果在[[Prototype]]链上层存在foo，但是它被标记为只读(writable:false)，那么 无法修改已有属性或者在 myObject 上创建屏蔽属性。如果运行在严格模式下，代码会 抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。
3. 如果在[[Prototype]]链上层存在foo并且它是一个setter(参见第3章)，那就一定会 调用这个 setter。foo 不会被添加到(或者说屏蔽于)myObject，也不会重新定义 foo 这 个 setter。

大多数开发者都认为如果向 [[Prototype]] 链上层已经存在的属性([[Put]])赋值，就一 定会触发屏蔽，但是如你所见，三种情况中只有一种(第一种)是这样的。
如果你希望在第二种和第三种情况下也屏蔽 foo，那就不能使用 = 操作符来赋值，而是使 用 Object.defineProperty(..)(参见第 3 章)来向 myObject 添加 foo。

### 隐式屏蔽

++ 操作

## “类”

JavaScript中只有对象，没有类。js是少有的可以不通过类，直接创建对象的语言。

### “类”函数

js都是在模仿类。

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

继承意味着复制操作，JavaScript(默认)并不会复制对象属性。相反，JavaScript 会在两 个对象之间创建一个关联，这样一个对象就可以通过委托访问另一个对象的属性和函数。 委托(参见第 6 章)这个术语可以更加准确地描述 JavaScript 中对象的关联机制。

### 对象关联

## 行为委托