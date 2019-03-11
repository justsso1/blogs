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

