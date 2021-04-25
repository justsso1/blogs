---
2020.3.12
---
Symbol
一句话介绍Symbol：
Symbol是ES6的第七种原始数据类型，(前六种是 Null Undefined Boolean String Number Object)，表示独一无二的值。

概述
1. 出现的原因
ES5对象的属性都是字符串类型，为了避免属性名冲突、不出现同名的属性，ES6创建了新的原始数据类型Symbol

2. 如何获得一个Symbol值
通过 Symbol函数创建，不能使用 new 命令，否则报错。因为生成的Symbol不是对象，而是一个原始数据类型，类似一种字符串的数据类型。

Javascript
let s= Symbol()
typeof s 
// "symbol"
3. Symbol函数的参数有哪几种
无参
字符串， 用来描述(description) Symbol值
对象，会调用对象的toString()，将其转化成字符串，用来描述Symbol值。
4. Symbol 值的比较
Symbol 函数中的参数，只是用来做描述符，（对程序员或者控制台有用，方便区分），但是没有任何两个 Symbol的值相等，Symbol代表独一无二的值。
就算两个都无参的Symbol 或者参数相同的Symbol也是不相等的。

5. 怎么成为对象的属性名
使用方括号[] 或者 Object.defineProperty ，就可以使用一个Symbol值作为对象的属性。

Symbol值用作对象属性名时，不能用点操作符，因为点操作符后面总是字符串。

注意： Symbol作为对象属性时，是公开属性，不是私有属性。

实战： 魔术字符串

Javascript

var shapeType = {
  triangle: 'Triangle'
};

function getArea(shape, options) {
  var area = 0;
  switch (shape) {
    case shapeType.triangle:
      area = .5 * options.width * options.height;
      break;
  }
  return area;
}

getArea(shapeType.triangle, { width: 100, height: 100 });
可以发现shapeType.triangle等于哪个值并不重要，只要确保不会跟其他shapeType属性的值冲突即可。因此，这里就很适合改用Symbol值。

Javascript
const shapeType = {
  triangle: Symbol()
};
上面代码中，除了将shapeType.triangle的值设为一个Symbol，其他地方都不用修改。

6. 属性名的遍历，妙用
Symbol属性不能被常规的方法遍历到，for … in Object.getOwnPropertyNames() Object.keys() 都不能遍历到Symbol属性名，但是Object.getOwnPropertySymbols
可以获取到Symbol属性名，所以利用这个特性我们可以做一些非私有的，但是又只想让内部访问到的属性名。

7. Symbol.for(), Symbol.keyFor()
Symbol.for()也是会生成一个Symbol的值，但是和Symbol()有区别。
Symbol.for()它会在全局环境中登录你创建的这个Symbol值，以供后面的Symbol.for()查找。所以Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，
而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。而Symbol()会每次返回一个新的Symbol值。

Symbol.keyFor方法返回一个已登记的 Symbol 类型值的key。

Javascript
var s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

var s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
需要注意的是，Symbol.for为Symbol值登记的名字，是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值。

Javascript
iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
// true
上面代码中，iframe 窗口生成的 Symbol 值，可以在主页面得到。

实战： 模块的 Singleton 模式 （Singleton n.独生子）

利用Symbol.for()在全局环境下只有一个，且要通过Symbol.keyFor()方法来找到。
但是这个也存在一些问题，也不可靠，再议。

内置的Symbol值
Symbol值可以自己定义之外，ES6 还提供了11个内置的Symbol值，指向语言内部使用的方法。

Symbol.iterator
对象的Symbol.iterator属性，指向该对象的默认遍历器方法。

Javascript
var myIterator = {};

myIterator[Symbol.iterator] =  function*(){ 
    yield 1;
    yield 2;
    yield 3;
}       

[... myIterator]  //[1,2,3]
   
//... 操作符，其实是使用了for of 将myIterator全部遍历一遍
对象进行for…of循环时，会调用Symbol.iterator方法，返回该对象的默认遍历器，详细介绍参见《Iterator和for…of循环》一章。

```Javascript
class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while(this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;

for(let value of myCollection) {
  console.log(value);
}
// 1
// 2

```