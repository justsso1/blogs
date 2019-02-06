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
