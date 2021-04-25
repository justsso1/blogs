---
2020.4.28
---

当前，大多数解决JavaScript中类型安全不足的解决方案都是基于静态类型检查和类型推断。TypeScript和Flow通过添加静态类型注释来拓展JavaScript，并且可以在编译时验证您的代码，并使用相同的抽象语法树来输出最终的JS代码。由于IDE可以依靠静态分析来提供自动完成和开发辅助，因此，这对于改善开发人员的体验非常有效。但是，关于类型安全，仍然存在一个主要缺陷：一旦使用JavaScript进行编译并在浏览器中运行，就不再保证所使用的变量具有预期的类型。

欺骗TypeScript非常容易。基本上，任何可以避免静态分析的操作都可能在不通知TypeScript的情况下潜在的更改变量的类型：

- 使用方括号和一个代表属性的变量来检索属性
- 通过HTML事件属性，setTimeout或Function构造函数进行动态代码评估
- 全局变量与外部库或浏览器扩展冲突
- 一个内置原型，该原型已被库或polyfill意外修改、
TypeScript开发人员试图避免上面的这些模式，并认为这是最佳实践。但是，由于开发人员对静态类型系统的信任，这可能导致一些混乱的问题，而忘记了它实际上最终是在计算机上运行的动态脚本语言。

JS中还有另一种类型安全的方法被遗忘了，可能值得更多关注：JavaScript本身中的强类型检查。

由于ECMAScript5和属性getters/setters，我们可以控制对对象属性进行的分配。看这个例子：

```Javascript
let _name = 'joe';
const user = {
    get name() {
        return _name
    },
    set name(value) {
        if (typeof value !== 'string') {
            throw new Error('传入类型不是字符串')
        } else {
            _name = value
        }
    }
}

user.name = 'hello'
user.name = 123 //Error: 传入类型不是字符串
```
只要你知道对象的所有属性名称并且始终在对象上定义它们，你就可以对对象属性进行简单的类型检查。setters还有其他的缺陷：他们无法捕获对象属性的所有操作，能很容易的通过Object.defineProperty()之类的方法推翻。

这使我们进入了ES6/ES2015最被低估的功能之一：Proxy对象。Proxy包裹目标对象，并充当透明传递。开发人员可以通过设置陷阱来拦截对该对象执行的所有操作。这正是为我们的代码带来强大的类型检查所需要的。

让我们用**Proxy**重写之前的代码：

```Javascript
const user = new Proxy({_name: 'joe'}, {
    set(target, p, value, receiver) {
        if (p === '_name' && typeof value !== 'string') {
            throw new Error('传入类型不是字符串')
        }
        return Reflect.set(target, p, value)
    }
})

user._name = 'hello'
user._name = 456 //Error: 传入类型不是字符串
```
在这里，我们仅对set操作进行了拦截，但是同样的，我们还可以对defineProperty、deleteProperty以及任何其他可以使用我们的属性值发生变化的陷阱进行拦截。

与`getters/ setters`的主要区别在于，`Proxy`不需要知道属性名称即可捕获执行的操作。这样就可以对尚未定义的动态属性进行类型检查，还可以编写更多通用的使用程序函数：

```Javascript
function checktype(obj, definition) {
    return new Proxy(obj, {
        set(obj, key, value, receiver) {
            if (key in definition && typeof value !== definition[key]) {
                 throw new Error(`${key}类型应该是: ${definition[key]}`)
            }
            return Reflect.set(obj, key, value)
        }
    })
}

class User {
    constructor(name, age) {
        //this 是实例
        return checktype(this, {
            name: 'string',
            age: 'number'
        })
    }
}

let joe = new User()
joe.name = 'joe';
joe.age = '12' //Error: age类型应该是: number
```
> (译者的话)注意：这里只能使用 let joe = new User(); joe.name = 'joe的形式，而不能使用let joe = new User({name: 11,age: '23'})，因为这样并不会触发 Proxy的set拦截，不会把属性写到this对象上，这样返回的对象是空的，没有属性 User {}

Proxy可以处理任何类型的对象，并且可能对变量的几乎任何操作都可以拦截。这包括function用做apply被调用，可以想象基于这些构建一个完整的类型检查系统。而这正是去年使用ObjectModel所做的事情。

```Javascript
// Basic Models
const PositiveInteger = BasicModel(Number)
   .assert(Number.isInteger)
   .assert(n => n >= 0, "should be greater or equal to zero")

// Object Models
class Person extends ObjectModel({ 
   name: String,
   age: PositiveInteger
}){
   greet(){ return `Hello I'm ${this.name}` }
}

// Function Models
Person.prototype.greetSomeone = FunctionModel(Person).return(String)(function(person){ 
    return `Hello ${person.name}, I'm ${this.name}` 
})
```

// and models for Arrays, Maps, Sets...
模型基本上是前面代码示例中类型检查功能的改进版本。 与TypeScript接口类似，它们的作用是确保变量符合模型定义。

这只是冰山一角。 因为所有这些都是在运行时完成的，所以我们可以想象出静态类型检查解决方案无法实现的所有用例：

- 验证来自REST API的JSON形式，并自动将嵌套数据转换为适当的JS类
- 检查来自localStorage或IndexedDB的内容的有效性
- 通过类型检查内置浏览器API来执行功能检测
- 快速将类型定义添加到来自CDN的外部库
  
现在我们的类型已从静态分析中解脱出来，我们甚至可以想象类型定义会根据应用程序的状态而变化：例如，一旦用户权限更改，便会立即向User实例添加新控件。

如果可以科学上网的话，可以观看视频 https://www.youtube.com/embed/zmojfyNH_EE

这些只是动态类型检查系统相对于静态检查的许多好处中的几个。 除此之外，它不需要学习新的语言或添加编译步骤。 它只是一个小的普通JavaScript库。

Proxy现在具有不错的浏览器支持，我认为是时候扩大我们对JavaScript类型安全性的了解了。 TypeScript和Flow提供了出色的开发人员体验，ObjectModel并不打算取代它们，但是仍有进行创新和尝试新方法的空间。

> （译者的话）虽然本文最后介绍了ObjectModel这个库，它是一个动态的类型检查js库，底层依赖的是ES6的Proxy，这说明，Proxy真的很强大，可以看看这个库的源码学习将Proxy用到实际工作中。
现在ObjectModel 4.0已经发布，采用ES Module，使用ES2018写的，所以源码也是学习JS的很好的例子。

原文地址：
https://medium.com/@SylvainPV/type-safety-in-javascript-using-es6-proxies-eee8fbbbd600