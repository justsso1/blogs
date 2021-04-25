---
2020.4.11
---
聊聊function与原型链
前言：function在js中扮演了举足轻重的角色，是一等公民。function和new在一起会有实例、原型、原型链等一系列问题。
function中访问变量会有作用域、作用域链的问题，以及闭包等概念。

本篇文章主要讲解原型链相关的内容，下篇文章将会讲解作用域链相关内容。

js中神奇的的function
js中的function其实是Function类型的实例。Function类型函数是js语言自有的类型，而一个具体的函数是Function类型的实例，函数名其实是一个指向函数实例对象的指针。
而且，js中的function只不过是将一些语句封装在一起，在函数被执行时，才确定它绑定的环境对象，才会创建活动对象，所以函数非常灵活，可以动态改变绑定的环境对象，达到复用。

function有两个重要的属性：arguments和this对象。arguments类似数组，保存着函数传入参数的一份副本，this对象是指函数据以执行的环境对象，本篇主要讲解this.

函数function即可以直接调用，也可以使用new变量调用，这样的函数叫构造函数，虽然本质上和普通函数没有区别，但是为了创建自定义类型，做出区分，构造函数的首字母一般大写。

然后js中的面向对象就很有趣了，javascript也是面向对象的程序设计语言，但它和传统语言如c++在面向对象的设计上有很大不同，js没有class类的概念，它利用function的prototype ，也就是原型链来完成面向对象的设计。
先看一下传统的面向对象程序的介绍吧：

面向对象程序设计以对象为核心，该方法认为程序由一系列对象组成。类是对现实世界的抽象，包括表示静态属性的数据和对数据的操作，对象是类的实例化。
对象间通过消息传递相互通信，来模拟现实世界中不同实体间的联系。在面向对象的程序设计中，对象是组成程序的基本模块。

要知道js这门语言的历史，它是创始人Brendan Eich大佬在几天之类创造出来的一门新的语言，为了让这门语言看起来像Java更受欢迎，才取名Javascript，当时js也是跑在浏览器中的脚本语言，也没想面向对象像强类型语言那样设计，
所以就成了利用function和prototype这个鬼样子来实现，可见，千万不要赶工啊～你看看为了完成任务，留了多少坑，泪～所以java和javascript是雷锋和雷峰塔的关系。

面向对象要有对象和继承，我们先讲js中怎么创建对象，然后讲怎么继承。

每一个function在声明的时候，就有一个prototype属性，它指向该构造函数的原型对象。利用new 操作构建函数创建的实例，这三者之间是什么关系呢？
构造函数的prototype指向原型对象，原型对象默认有一个constructor属性指向构造函数；实例有一个proto属性指向原型对象。

![原型对象、实例、构造函数的关系](http://cdn.hixiaoya.com/blogs/imgs/js%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1/%E5%8E%9F%E5%9E%8B%E5%AF%B9%E8%B1%A1%E3%80%81%E5%AE%9E%E4%BE%8B%E3%80%81%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0.png)

虽然创建对象可以使用new Object()之类的，但是要实现面向对象的继承，就离不开原型链了。

构造函数其实是js中创建对象的一种方式，还有其他方式，如工厂模式、原型模式、组合使用构造函数和原型模式等，本篇文章会讲和原型链相关的，其他的不会细细的讲。

创建对象
工厂模式
工厂模式，就是封装一个函数，内部负责生产对象。

```Javascript
 var o = new Object(); 
 o.name = name; 
 o.age = age; 
 o.job = job; 
 o.sayName = function(){ 
 alert(this.name); 
 }; 
 return o; 
} 
var person1 = createPerson("Nicholas", 29, "Software Engineer"); 
var person2 = createPerson("Greg", 27, "Doctor");

```

缺点：生产出的对象没有类型可言。

构造函数模式
开头说了function可以作为构造函数用new创建实例，上文也基本说了构造函数。

```Javascript
function Person(name, age, job){ 
 this.name = name; 
 this.age = age; 
 this.job = job; 
 this.sayName = function(){ 
 alert(this.name); 
 }; 
} 
var person1 = new Person("Nicholas", 29, "Software Engineer"); 
var person2 = new Person("Greg", 27, "Doctor");
```

现在可以说说new，虽然javascript使用new来连接构造函数和对象，但是js中的new和java中的new的含义很不同。
new操作符实际上会经历以下4步：
(1) 创建一个新对象；
(2) 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
(3) 执行构造函数中的代码（为这个新对象添加属性）；
(4) 返回新对象。

原型模式
因为所有实例的原型对象事同一个，所以原型对象上面的属性，所有实例共享，也算是可以少些一些代码创建对象了。

```Javascript
function Person(){ 
} 
Person.prototype.name = "Nicholas"; 
Person.prototype.age = 29; 
Person.prototype.job = "Software Engineer"; 
Person.prototype.sayName = function(){ 
 alert(this.name); 
}; 
var person1 = new Person(); 
person1.sayName(); //"Nicholas" 
var person2 = new Person(); 
person2.sayName(); //"Nicholas" 
alert(person1.sayName == person2.sayName); //true
```

原型对象上面的基本类型属性还好，会创建值的副本，但是对于引用类型属性，指的是同一个地址，不同实例之间操作引用类型属性是对互相影响的。还有函数，函数也是一个独享，每个实例都会
创建一个匿名函数绑定在sayName上面，就会造成内存浪费，函数可以只创建一个，执行的时候动态改变this就可。

原型链：

如果一个原型对象是另一个类型的实例，依次递推，那么就形成了原型链。

```Javascript
function Person(){ 
} 
Person.prototype.name = "Nicholas"; 
Person.prototype.age = 29; 
Person.prototype.job = "Software Engineer"; 
Person.prototype.sayName = function(){ 
 alert(this.name); 
}; 
var person1 = new Person(); 
person1.sayName(); //"Nicholas" 
var person2 = new Person(); 
person2.sayName(); //"Nicholas" 
alert(person1.sayName == person2.sayName); //true
```


可能会觉得Person.prototype太麻烦了，想Person.prototype = {}这样写，但是这样写会

重写原型对象，原型对象中的constructor消失，原型链也断了。所以要手动的添加constructor，手动连接原型链。

```Javascript
function Person(){ 
} 
Person.prototype = { 
 constructor : Person, 
 name : "Nicholas", 
 age : 29, 
 job: "Software Engineer", 
 sayName : function () { 
 alert(this.name); 
 } 
};
```

组合使用构造函数和原型模式
创建自定义类型的最常见方式，就是组合使用构造函数模式与原型模式。构造函数模式用于定义实
例属性，而原型模式用于定义方法和共享的属性。结果，每个实例都会有自己的一份实例属性的副本，
但同时又共享着对方法的引用，最大限度地节省了内存。另外，这种混成模式还支持向构造函数传递参
数；可谓是集两种模式之长。下面的代码重写了前面的例子。

```Javascript
function Person(name, age, job){ 
 this.name = name; 
 this.age = age; 
 this.job = job; 
 this.friends = ["Shelby", "Court"]; 
} 
Person.prototype = { 
 constructor : Person, 
 sayName : function(){ 
 alert(this.name); 
 } 
} 
var person1 = new Person("Nicholas", 29, "Software Engineer"); 
var person2 = new Person("Greg", 27, "Doctor"); 
person1.friends.push("Van"); 
alert(person1.friends); //"Shelby,Count,Van" 
alert(person2.friends); //"Shelby,Count" 
alert(person1.friends === person2.friends); //false 
alert(person1.sayName === person2.sayName); //true
```

在这个例子中，实例属性都是在构造函数中定义的，而由所有实例共享的属性 constructor 和方
法 sayName()则是在原型中定义的。而修改了 person1.friends（向其中添加一个新字符串），并不
会影响到 person2.friends，因为它们分别引用了不同的数组。
这种构造函数与原型混成的模式，是目前在 ECMAScript 中使用最广泛、认同度最高的一种创建自
定义类型的方法。可以说，这是用来定义引用类型的一种默认模式。

## 继承
是怎么实现继承的？利用原型链，形成”父类””子类”的关系，虽然不如java语言那样的完美，但也可以模拟出来。
子类的原型对象是父类的实例的话，那么父类实例上面的属性和方法，子类都可以访问到，算是”继承”了。通过实现原型链，本质上扩展了本章前面介绍的原型搜索机制。

```Javascript
 this.property = true; 
} 
SuperType.prototype.getSuperValue = function(){ 
 return this.property; 
}; 
function SubType(){ 
 this.subproperty = false; 
} 
//继承了 SuperType 
SubType.prototype = new SuperType(); 
SubType.prototype.getSubValue = function (){ 
 return this.subproperty; 
}; 
var instance = new SubType(); 
alert(instance.getSuperValue()); //trueJavascript
 this.property = true; 
} 
SuperType.prototype.getSuperValue = function(){ 
 return this.property; 
}; 
function SubType(){ 
 this.subproperty = false; 
} 
//继承了 SuperType 
SubType.prototype = new SuperType(); 
SubType.prototype.getSubValue = function (){ 
 return this.subproperty; 
}; 
var instance = new SubType(); 
alert(instance.getSuperValue()); //true
```