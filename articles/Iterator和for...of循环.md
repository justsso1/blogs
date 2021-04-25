---
2020.3.12
---

Iterator和for…of循环
Iterator和for（遍历器）概念
1. 出现的原因
ES6 中有4种表示”集合”的数据结构，主要是数组Array 对象Object Set Map，用户可以定义自己得数据结构，比如Set里嵌套Map,Map里嵌套Object，这样就需要一种统一的接口机制，来处理所有不同的数据结构。
遍历器（Iterator）就是这样一种机制，它是一种接口，为各种不同的数据结构提供统一的访问机制。
任何数据结构只要部署Iterator接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

2.Iterator的作用
为各种数据结构，提供一个统一的、简便的访问接口
使得数据结构的成员能够按某种次序排列
ES6创造了一种新的遍历命令for…of循环，Iterator接口主要供for…of消费
原生具备Iterator接口的数据结构
在ES6中，有三类数据结构原生具备Iterator接口：数组、某些类似数组的对象、Set和Map结构。可以被for…of循环遍历，这些数据结构原生就部署了Symbol iterator属性，
凡是部署了Symbol iterator属性的数据结构，
就称为部署了遍历器接口，调用这个接口就会返回一个遍历器对象。

数据结构的默认Iterator接口
遍历器的根本特征上是含有 next()方法。

当使用for…of循环遍历某种数据结构时，该循环会自动去寻找Iterator接口。

一种数据结构只要部署了Iterator接口，我们就称这种数据结构是”可遍历的“（iterable）。

Javascript
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
上面提到，原生就部署Iterator接口的数据结构有三类，对于这三类数据结构，不用自己写遍历器生成函数，for…of循环会自动遍历它们，执行遍历器对象的next()方法

除此之外，其他数据结构（主要是对象）的Iterator接口，都需要自己在Symbol.iterator属性上面部署，这样才会被for…of循环遍历。

对象（Object）之所以没有默认部署Iterator接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定。
本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。
不过，严格地说，对象部署遍历器接口并不是很必要，因为这时对象实际上被当作Map结构使用，ES5没有Map结构，而ES6原生提供了。

一个对象如果要有可被for…of循环调用的Iterator接口，就必须在Symbol.iterator的属性上部署遍历器生成方法（原型链上的对象具有该方法也可）。

通过遍历器实现指针结构的例子：

Javascript
function Object(value){
    this.value= value;
    this.next = null;
}       
Obj.prototype[Symbol.iterator] = function() {
  var iterator = {
    next: next
  };

  var current = this;

  function next() {
    if (current) {
      var value = current.value;
      current = current.next;
      return {
        done: false,
        value: value
      };
    } else {
      return {
        done: true
      };
    }
  }
  return iterator;
}

var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;

for (var i of one){
  console.log(i);
}
// 1
// 2
// 3
调用Iterator接口的场合
有一些场合会默认调用Iterator接口（即Symbol.iterator方法），除了下文会介绍的for … of循环，还有几个别的场合。

1. 解构赋值
[first,... rest]
2. 扩展运算符
...
3. yield
yield* 后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

Javascript

let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
4. 其他场合

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。

for…of
Array.from()
Map() Set() WeakMap() WeakSet(),（比如new Map([[‘a’,1],[‘b’,2]])）
Promise.all()
Promise.race()
字符串的Iterator接口
Iterator接口与Generator函数
Symbol.Iterator方法的最简单实现，还是使用一下Generator函数

Set Map结构
Map遍历返回的是一个数组，0位是键名，1位是键值

与其他遍历语法的比较
以数组为例，JavaScript提供多种遍历语法。最原始的写法就是for循环。

Javascript

for (var index = 0; index < myArray.length; index++) {
  console.log(myArray[index]);
}
这种写法比较麻烦，因此数组提供内置的forEach方法。

Javascript

myArray.forEach(function (value) {
  console.log(value);
});
这种写法的问题在于，无法中途跳出forEach循环，break命令或return命令都不能奏效。

for…in循环可以遍历数组的键名。

Javascript

for (var index in myArray) {
  console.log(myArray[index]);
}
for…in循环有几个缺点。

数组的键名是数字，但是for…in循环是以字符串作为键名“0”、“1”、“2”等等。
for…in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
某些情况下，for…in循环会以任意顺序遍历键名。
总之，for…in循环主要是为遍历对象而设计的，不适用于遍历数组。

for…of循环相比上面几种做法，有一些显著的优点。

Javascript
for (let value of myArray) {
  console.log(value);
}
有着同for…in一样的简洁语法，但是没有for…in那些缺点。
不同用于forEach方法，它可以与break、continue和return配合使用。
提供了遍历所有数据结构的统一操作接口。
下面是一个使用break语句，跳出for…of循环的例子。

Javascript

for (var n of fibonacci) {
  if (n > 1000)
    break;
  console.log(n);
}
上面的例子，会输出斐波纳契数列小于等于1000的项。如果当前项大于1000，就会使用break语句跳出for…of循环。

