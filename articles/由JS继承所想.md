# 由JS继承所想

##原型

JavaScript 不包含传统的类继承模型，而是使用 *prototype* 原型模型。

虽然这经常被当作是 JavaScript 的缺点被提及，其实基于原型的继承模型比传统的类继承还要强大。 实现传统的类继承模型是很简单，但是实现 JavaScript 中的原型继承则要困难的多。

由于 JavaScript 是唯一一个被广泛使用的基于原型继承的语言，所以理解两种继承模式的差异是需要一定时间的。

第一个不同之处在于 JavaScript 使用*原型链*的继承方式。

**注意:** 简单的使用 `Bar.prototype = Foo.prototype` 将会导致两个对象共享**相同**的原型。 因此，改变任意一个对象的原型都会影响到另一个对象的原型，在大多数情况下这不是希望的结果。

```javascript
function Foo() {
    this.value = 42;
}
Foo.prototype = {
    method: function() {}
};

function Bar() {}

// 设置Bar的prototype属性为Foo的实例对象
Bar.prototype = new Foo();
Bar.prototype.foo = 'Hello World';

// 修正Bar.prototype.constructor为Bar本身
Bar.prototype.constructor = Bar;

var test = new Bar() // 创建Bar的一个新实例

// 原型链
test [Bar的实例]
    Bar.prototype [Foo的实例] 
        { foo: 'Hello World' }
        Foo.prototype
            {method: ...};
            Object.prototype
                {toString: ... /* etc. */};
```

**注意:** **不要**使用 `Bar.prototype = Foo`，因为这不会执行 `Foo` 的原型，而是指向函数 `Foo`。 因此原型链将会回溯到 `Function.prototype` 而不是 `Foo.prototype`，因此 `method` 将不会在 Bar 的原型链上。

上面的例子中，`test` 对象从 `Bar.prototype` 和 `Foo.prototype` 继承下来；因此， 它能访问 `Foo` 的原型方法 `method`。同时，它也能够访问**那个**定义在原型上的 `Foo` 实例属性 `value`。 需要注意的是 `new Bar()` **不会**创造出一个新的 `Foo` 实例，而是 重复使用它原型上的那个实例；因此，所有的 `Bar`实例都会共享**相同**的 `value` 属性。

### 属性查找

当查找一个对象的属性时，JavaScript 会**向上**遍历原型链，直到找到给定名称的属性为止。

到查找到达原型链的顶部 - 也就是 `Object.prototype` - 但是仍然没有找到指定的属性，就会返回 [undefined](http://bonsaiden.github.io/JavaScript-Garden/zh/#core.undefined)。

### 原型属性

当原型属性用来创建原型链时，可以把**任何**类型的值赋给它（prototype）。 然而将原子类型赋给 prototype 的操作将会被忽略。

```javascript
function Foo() {}
Foo.prototype = 1; // 无效
```

而将对象赋值给 prototype，正如上面的例子所示，将会动态的创建原型链。

### 性能

如果一个属性在原型链的上端，则对于查找时间将带来不利影响。特别的，试图获取一个不存在的属性将会遍历整个原型链。

并且，当使用 `for in` 循环遍历对象的属性时，原型链上的**所有**属性都将被访问。

### 扩展内置类型的原型

一个错误特性被经常使用，那就是扩展 `Object.prototype` 或者其他内置类型的原型对象。

这种技术被称之为 [monkey patching](http://en.wikipedia.org/wiki/Monkey_patch) 并且会破坏*封装*。虽然它被广泛的应用到一些 JavaScript 类库中比如 [Prototype](http://prototypejs.org/), 但是我仍然不认为为内置类型添加一些*非标准*的函数是个好主意。

扩展内置类型的**唯一**理由是为了和新的 JavaScript 保持一致，比如 [`Array.forEach`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach)。

### 总结

在写复杂的 JavaScript 应用之前，充分理解原型链继承的工作方式是每个 JavaScript 程序员**必修**的功课。 要提防原型链过长带来的性能问题，并知道如何通过缩短原型链来提高性能。 更进一步，绝对**不要**扩展内置类型的原型，除非是为了和新的 JavaScript 引擎兼容。

## `hasOwnProperty` 函数

为了判断一个对象是否包含*自定义*属性而*不是*[原型链](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.prototype)上的属性， 我们需要使用继承自 `Object.prototype` 的 `hasOwnProperty` 方法。

**注意:** 通过判断一个属性是否 `undefined` 是**不够**的。 因为一个属性可能确实存在，只不过它的值被设置为 `undefined`。

`hasOwnProperty` 是 JavaScript 中唯一一个处理属性但是**不**查找原型链的函数。

```javascript
// 修改Object.prototype
Object.prototype.bar = 1; 
var foo = {goo: undefined};

foo.bar; // 1
'bar' in foo; // true

foo.hasOwnProperty('bar'); // false
foo.hasOwnProperty('goo'); // true
```

只有 `hasOwnProperty` 可以给出正确和期望的结果，这在遍历对象的属性时会很有用。 **没有其它方法可以用来排除原型链上的属性，而不是定义在对象<u>自身</u>上的属性。**

### `hasOwnProperty` 作为属性

JavaScript **不会**保护 `hasOwnProperty` 被非法占用，因此如果一个对象碰巧存在这个属性， 就需要使用*外部*的 `hasOwnProperty` 函数来获取正确的结果。

```javascript
var foo = {
    hasOwnProperty: function() {
        return false;
    },
    bar: 'Here be dragons'
};

foo.hasOwnProperty('bar'); // 总是返回 false

// 使用其它对象的 hasOwnProperty，并将其上下文设置为foo
({}).hasOwnProperty.call(foo, 'bar'); // true
```

### 结论

当检查对象上某个属性是否存在时，`hasOwnProperty` 是**唯一**可用的方法。 同时在使用 [`for in` loop](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.forinloop) 遍历对象时，推荐**总是**使用 `hasOwnProperty` 方法， 这将会避免[原型](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.prototype)对象扩展带来的干扰。

## `for in` 循环

和 `in` 操作符一样，`for in` 循环同样在查找对象属性时遍历原型链上的所有属性。

**注意:** `for in` 循环**不会**遍历那些 `enumerable` 设置为 `false` 的属性；比如数组的 `length` 属性。

```javascript
// 修改 Object.prototype
Object.prototype.bar = 1;

var foo = {moo: 2};
for(var i in foo) {
    console.log(i); // 输出两个属性：bar 和 moo
}
```

由于不可能改变 `for in` 自身的行为，因此有必要过滤出那些不希望出现在循环体中的属性， 这可以通过 `Object.prototype` 原型上的 [`hasOwnProperty`](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.hasownproperty)函数来完成。

**注意:** 由于 `for in` 总是要遍历整个原型链，因此如果一个对象的继承层次太深的话会影响性能。

### 使用 `hasOwnProperty` 过滤

```
// foo 变量是上例中的
for(var i in foo) {
    if (foo.hasOwnProperty(i)) {
        console.log(i);
    }
}
```

这个版本的代码是唯一正确的写法。由于我们使用了 `hasOwnProperty`，所以这次**只**输出 `moo`。 如果不使用 `hasOwnProperty`，则这段代码在原生对象原型（比如 `Object.prototype`）被扩展时可能会出错。

一个广泛使用的类库 [Prototype](http://www.prototypejs.org/) 就扩展了原生的 JavaScript 对象。 因此，当这个类库被包含在页面中时，不使用 `hasOwnProperty` 过滤的 `for in` 循环难免会出问题。

### 总结

推荐**总是**使用 `hasOwnProperty`。不要对代码运行的环境做任何假设，不要假设原生对象是否已经被扩展了。



---

## 构造函数、原型对象和实例之间的关系

每个构造函数都有一个`prototype`属性指向原型对象，原型对象有一个指针（`constructor`）指向构造函数，实例有一个 `__proto__` 的指针指向原型对象，实例中的`constructor`属性会遵从原型对象的`constructor`属性的值。



-------

## JS继承原因

很多面向对象的语言都支持两种继承方式：接口继承和实现继承。接口继承只支持**方法签名**，而实现继承则继承实际的方法。由于函数没有签名，ECMAScript只支持实现继承，而且其实现继承主要是依靠**原型链**来实现的。

### 原型链

**原型链的基本概念：**

实例和原型对象是有直接关系的，而和构造函数没有直接关系，所以原型对象是另外一个对象的实例的时候，原型链其实就延伸了，如此层层递进，就构成了实例和原型的链条。

继承实现的本质是重写原型对象，代之以一个新类型的实例。

```javascript
function SuperType(){
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
alert(instance.getSuperValue());
```

以上代码定义了两个类型:SuperType 和 SubType。每个类型分别有一个属性和一个方法。它们的主要区别是 SubType 继承了 SuperType，**而继承是通过创建 SuperType 的实例，并将该实例赋给SubType.prototype 实现的。实现的本质是重写原型对象，代之以一个新类型的实例**。换句话说，原来存在于 SuperType 的实例中的所有属性和方法，现在也存在于 SubType.prototype 中了。在确立了继承关系之后，我们给 SubType.prototype 添加了一个方法，这样就在继承了 SuperType 的属性和方法的基础上又添加了一个新方法。这个例子中的实例以及构造函数和原型之间的关系如下图。

![](/Users/ssojust/gitproject/blogs/imgs/js继承/原型链继承1.png)

在上面的代码中，我们没有使用 SubType 默认提供的原型，而是给它换了一个新原型;这个新原型就是 SuperType 的实例。于是，新原型不仅具有作为一个 SuperType 的实例所拥有的全部属性和方法，而且其内部还有一个指针，指向了 SuperType 的原型。最终结果就是这样的:instance 指向 SubType 的原型，SubType 的原型又指向 SuperType 的原型。getSuperValue()方法仍然还在SuperType.prototype 中，但 property 则位于SubType.prototype 中。这是因为 property 是一个实例属性，而 getSuperValue()则是一个原型方法。既然SubType.prototype 现在是 SuperType的实例，那么 property 当然就位于该实例中了。此外，要注意 instance.constructor 现在指向的 是 SuperType，这是因为原来 SubType.prototype 中的 constructor 被~~重写~~了的缘故( **实际上，不是 SubType 的原型的 constructor 属性被重写了，而是 SubType 的原型指向了另一个对象——SuperType 的原型，而这个原型对象的 constructor 属性指向的是 SuperType。**)。 

通过实现原型链，本质上扩展了本章前面介绍的原型搜索机制。读者大概还记得，当以读取模式访 问一个实例属性时，首先会在实例中搜索该属性。如果没有找到该属性，则会继续搜索实例的原型。在 通过原型链实现继承的情况下，搜索过程就得以沿着原型链继续向上。就拿上面的例子来说，调用 instance.getSuperValue()会经历三个搜索步骤:1)搜索实例;2)搜索 SubType.prototype; 3)搜索 SuperType.prototype，最后一步才会找到该方法。在找不到属性或方法的情况下，搜索过 程总是要一环一环地前行到原型链末端才会停下来。 

**1. 别忘记默认的原型**

事实上，前面例子中展示的原型链还少一环。我们知道，所有引用类型默认都继承了 Object，而
这个继承也是通过原型链实现的。大家要记住，所有函数的默认原型都是 Object 的实例，因此默认原
型都会包含一个内部指针，指向 Object.prototype。这也正是所有自定义类型都会继承 toString()、
valueOf()等默认方法的根本原因。所以，我们说上面例子展示的原型链中还应该包括另外一个继承层
次。

![](/Users/ssojust/gitproject/blogs/imgs/js继承/原型链继承2.png)

一句话，SubType 继承了 SuperType，而 SuperType 继承了 Object。当调用 instance.toString() 

时，实际上调用的是保存在 Object.prototype 中的那个方法。 

**2.确定原型和实例的关系**

可以通过两种方式来确定原型和实例之间的关系。第一种方式是使用 instanceof 操作符，只要用 这个操作符来测试实例与原型链中出现过的构造函数，结果就会返回 true。以下几行代码就说明了这 一点。 

```javascript
alert(instance instanceof Object);	//true
alert(instance instanceof SuperType);  //true
alert(instance instanceof SubType);   //true
```

由于原型链的关系，我们可以说 instance 是 Object、SuperType 或 SubType 中任何一个类型 的实例。因此，测试这三个构造函数的结果都返回了 true。 



第二种方式是使用 isPrototypeOf()方法。同样，只要是原型链中出现过的原型，都可以说是该 原型链所派生的实例的原型，因此 isPrototypeOf()方法也会返回 true，如下所示。 

```javascript
alert(Object.prototype.isPrototypeOf(instance));		//true
alert(SuperType.prototype.isPrototypeOf(instance));	//true	
alert(SubType.prototype.isPrototypeOf(instance));		//true
```

**3.谨慎的定义方法**

子类型有时候需要重写超类型中的某个方法，或者需要添加超类型中不存在的某个方法。但不管怎
样，给原型添加方法的代码一定要放在替换原型的语句之后。来看下面的例子。

```javascript
function SuperType(){
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
//添加新方法
SubType.prototype.getSubValue = function (){
    return this.subproperty;
};
//重写超类型中的方法 SubType.prototype.getSuperValue = function (){
    return false;
};
var instance = new SubType();
alert(instance.getSuperValue());   //false
```

在以上代码中，加粗的部分是两个方法的定义。第一个方法 getSubValue()被添加到了 SubType
中。第二个方法 getSuperValue()是原型链中已经存在的一个方法，但重写这个方法将会屏蔽原来的
那个方法。换句话说，当通过 SubType 的实例调用 getSuperValue()时，调用的就是这个重新定义
的方法;但通过 SuperType 的实例调用 getSuperValue()时，还会继续调用原来的那个方法。这里
要格外注意的是，必须在用 SuperType 的实例替换原型之后，再定义这两个方法。

还有一点需要提醒读者，即在通过原型链实现继承时，不能使用对象字面量创建原型方法。因为这
样做就会重写原型链，如下面的例子所示。

```javascript
function SuperType(){
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
//使用字面量添加新方法，会导致上一行代码无效 SubType.prototype = {
    getSubValue : function (){
        return this.subproperty;
},
    someOtherMethod : function (){
        return false;
} };
var instance = new SubType();
alert(instance.getSuperValue());   //error!
```

以上代码展示了刚刚把 SuperType 的实例赋值给原型，紧接着又将原型替换成一个对象字面量而
导致的问题。由于现在的原型包含的是一个 Object 的实例，而非 SuperType 的实例，因此我们设想
中的原型链已经被切断——SubType 和 SuperType 之间已经没有关系了。

**4.原型链的问题**（原型中的引用类型属性会共享，比如数组）

原型链虽然很强大，可以用它来实现继承，但它也存在一些问题。其中，最主要的问题来自包含引
用类型值的原型。想必大家还记得，我们前面介绍过包含引用类型值的原型属性会被所有实例共享;而
这也正是为什么要在构造函数中，而不是在原型对象中定义属性的原因。在通过原型来实现继承时，原
型实际上会变成另一个类型的实例。于是，原先的实例属性也就顺理成章地变成了现在的原型属性了。
下列代码可以用来说明这个问题。

```javascript
function SuperType(){
        this.colors = ["red", "blue", "green"];  
}
function SubType(){
}

//继承了 SuperType
SubType.prototype = new SuperType();

var instance1 = new SubType(); instance1.colors.push("black"); 
alert(instance1.colors); //"red,blue,green,black"

var instance2 = new SubType(); 
alert(instance2.colors); //"red,blue,green,black"
```



这个例子中的 SuperType 构造函数定义了一个 colors 属性，该属性包含一个数组(引用类型值)。 SuperType 的每个实例都会有各自包含自己数组的 colors 属性。当 SubType 通过原型链继承了 SuperType 之后，SubType.prototype 就变成了 SuperType 的一个实例，因此它也拥有了一个它自 己的 colors 属性——就跟专门创建了一个 SubType.prototype.colors 属性一样。但结果是什么 呢?结果是 SubType 的所有实例都会共享这一个 colors 属性。而我们对 instance1.colors 的修改 能够通过 instance2.colors 反映出来，就已经充分证实了这一点。 

原型链的第二个问题是:在创建子类型的实例时，不能向超类型的构造函数中传递参数。实际上， 应该说是没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数。有鉴于此，再加上 前面刚刚讨论过的由于原型中包含引用类型值所带来的问题，实践中很少会单独使用原型链。 

### 借用构造函数

在解决原型中包含引用类型值所带来问题的过程中，开发人员开始使用一种叫做借用构造函数 (constructor stealing)的技术(有时候也叫做伪造对象或经典继承)。这种技术的基本思想相当简单，即 

在子类型构造函数的内部调用超类型构造函数。别忘了，函数只不过是在特定环境中执行代码的对象， 因此通过使用 apply()和 call()方法也可以在(将来)新创建的对象上执行构造函数，如下所示: 

```javascript

function SuperType(){
    this.colors = ["red", "blue", "green"];
}
 function SubType(){
		//继承了 SuperType
    SuperType.call(this);
}

var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors);    //"red,blue,green,black"

var instance2 = new SubType();
alert(instance2.colors);    //"red,blue,green"
```

代码中加粗的那一行代码“借调”了超类型的构造函数。通过使用 call()方法(或 apply()方法
也可以)，我们实际上是在(未来将要)新创建的 SubType 实例的环境下调用了 SuperType 构造函数。
这样一来，就会在新 SubType 对象上执行 SuperType()函数中定义的所有对象初始化代码。结果，
SubType 的每个实例就都会具有自己的 colors 属性的副本了。

1. 传递参数 

相对于原型链而言，借用构造函数有一个很大的优势，即可以在子类型构造函数中向超类型构造函 数传递参数。看下面这个例子。 

```javascript
function SuperType(name){
    this.name = name;
}
function SubType(){
	//继承了 SuperType，同时还传递了参数 SuperType.call(this, "Nicholas");
	//实例属性
    this.age = 29;
}

var instance = new SubType();

alert(instance.name);    //"Nicholas";
alert(instance.age);     //29
```

以上代码中的 SuperType 只接受一个参数 name，该参数会直接赋给一个属性。在 SubType 构造 函数内部调用 SuperType 构造函数时，实际上是为 SubType 的实例设置了 name 属性。为了确保 SuperType 构造函数不会重写子类型的属性，可以在调用超类型构造函数后，再添加应该在子类型中 定义的属性。 

2. 借用构造函数的问题 

如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题——方法都在构造函数中定 义，因此函数复用就无从谈起了。而且，在超类型的原型中定义的方法，对子类型而言也是不可见的，结 果所有类型都只能使用构造函数模式。考虑到这些问题，借用构造函数的技术也是很少单独使用的。 

### 组合继承



