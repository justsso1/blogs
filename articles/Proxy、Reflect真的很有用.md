---
2020.4.26
---
## Proxy
### Proxy是什么
这里我想简单来说，`Proxy`是对象的代理器，很好理解，我们有一个很重要的对象，我们不希望别人随便获取修改该对象，我们要保护该对象，用另外一个对象代理它，对真正要操作的对象是一种数据保护和过滤。

`Proxy`并不是简单的通过我们常见的代码形式如if else对对象进行保护，它是在代码编程层面对对象进行保护，属于“元编程”。比如，在读取或设置对象的属性时，我们可以利用get() set()进行代理，执行函数时（函数本来就是对象）可以使用apply(),函数当作构造器时，可以使用constructor进行拦截。

### Proxy的拦截操作有哪些
虽然是代理器，但是也不能任由程序员“自由发挥”，所以`ES6`中对`Proxy`做了一些限制，`Proxy`支持的拦截操作有下面这些：

- get(target, propKey, receiver): 拦截对象属性的读取
- set(target, propKey, value, receiver): 拦截对象属性的设置
- has(target, propKey): 拦截`propKey in proxy`操作，返回一个布尔值
- deleteProperty(target, propKey): 拦截`delete proxy[propKey]`的操作，返回布尔值
- ownKeys(target): 拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
- getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
- defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
- preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
- getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
- isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
- setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

```javascript
var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

fproxy(1, 2) // 1
new fproxy(1, 2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo === "Hello, foo" // true
```

### Proxy的应用 

Proxy提供的拦截器很多种，可以根据具体的需求，组合这些拦截器达到自己的目的

- #### 防止对象的内部属性(私有属性)被外部读写，达到类型安全
JS对象中的私有属性没有规定，我们都是约定使用前缀是'_'代表私有属性，但还是并不“私有”。可以使用Proxy做到私有属性，在get/set属性时，判断首字符是否是'_',如果是，则剖出错误。

```javascript
const handle = {
    get(target, p, receiver) {
        inver(p, 'get')
        return target[p]
    },
    set(target, p, value, receiver) {
        inver(p, 'set')
        target[p] = value
        return true;
    }
}

function inver(key, action) {
    if (key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} ${key}`)
    }
}

try {
    const target = {}
    const proxy = new Proxy(target, handle)
    proxy._prop
    proxy._prop = 'c'
} catch (e) {
    console.log(e) // Error: Invalid attempt to get private "_prop" property
}

```
- #### 使用`has`方法隐藏某些属性，不被`in`运算符发现

```javascript
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false
```

- #### 中断处理 `Proxy.revocable()`
  
`Proxy.revocable`方法返回一个可取消的 Proxy 实例

```javascript
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```

`Proxy.revocable`方法返回一个对象，该对象的`proxy`属性是`Proxy`实例，`revoke`属性是一个函数，可以取消`Proxy`实例。上面代码中，当执行`revoke`函数之后，再访问`Proxy`实例，就会抛出一个错误。

`Proxy.revocable`的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

- #### 抽离校验模块，类型检查

```
let numericDataStore = {  
    count: 0,
    amount: 1234,
    total: 14
};

numericDataStore = new Proxy(numericDataStore, {  
    set(target, key, value, proxy) {
        if (typeof value !== 'number') {
            throw Error("Properties in numericDataStore can only be numbers");
        }
        return Reflect.set(target, key, value, proxy);
    }
});

// 抛出错误，因为 "foo" 不是数值
numericDataStore.count = "foo";

// 赋值成功
numericDataStore.count = 333;
```

可以查看我的另一篇翻译文章：[在JavaScript中使用ES6 Proxy做类型安全]( https://juejin.im/post/6844904143262318605)
Proxy可以做到动态的类型检查

- #### 访问日志
对于那些调用频繁、运行缓慢或占用执行环境资源较多的属性或接口，开发者会希望记录它们的使用情况或性能表现，这个时候就可以使用 Proxy 充当中间件的角色，轻而易举实现日志功能：
```javascript
let api = {  
    _apiKey: '123abc456def',
    getUsers: function() { /* ... */ },
    getUser: function(userId) { /* ... */ },
    setUser: function(userId, config) { /* ... */ }
};

function logMethodAsync(timestamp, method) {  
    setTimeout(function() {
        console.log(`${timestamp} - Logging ${method} request asynchronously.`);
    }, 0)
}

api = new Proxy(api, {  
    get: function(target, key, proxy) {
        var value = target[key];
        return function(...arguments) {
            logMethodAsync(new Date(), key);
            return Reflect.apply(value, target, arguments);
        };
    }
});

api.getUsers();

```
- #### 预警和拦截
假设你不想让其他开发者删除 noDelete 属性，还想让调用 oldMethod 的开发者了解到这个方法已经被废弃了，或者告诉开发者不要修改 doNotChange 属性，那么就可以使用 Proxy 来实现：
```javascript
let dataStore = {  
    noDelete: 1235,
    oldMethod: function() {/*...*/ },
    doNotChange: "tried and true"
};

const NODELETE = ['noDelete'];  
const NOCHANGE = ['doNotChange'];
const DEPRECATED = ['oldMethod'];  

dataStore = new Proxy(dataStore, {  
    set(target, key, value, proxy) {
        if (NOCHANGE.includes(key)) {
            throw Error(`Error! ${key} is immutable.`);
        }
        return Reflect.set(target, key, value, proxy);
    },
    deleteProperty(target, key) {
        if (NODELETE.includes(key)) {
            throw Error(`Error! ${key} cannot be deleted.`);
        }
        return Reflect.deleteProperty(target, key);

    },
    get(target, key, proxy) {
        if (DEPRECATED.includes(key)) {
            console.warn(`Warning! ${key} is deprecated.`);
        }
        var val = target[key];

        return typeof val === 'function' ?
            function(...args) {
                Reflect.apply(target[key], target, args);
            } :
            val;
    }
});

// these will throw errors or log warnings, respectively
dataStore.doNotChange = "foo";  
delete dataStore.noDelete;  
dataStore.oldMethod();
```

- #### 过略操作
某些操作会非常占用资源，比如传输大文件，这个时候如果文件已经在分块发送了，就不需要在对新的请求作出相应（非绝对），这个时候就可以使用 Proxy 对当请求进行特征检测，并根据特征过滤出哪些是不需要响应的，哪些是需要响应的。下面的代码简单演示了过滤特征的方式，并不是完整代码，相信大家会理解其中的妙处：
```javascript
let obj = {  
    getGiantFile: function(fileId) {/*...*/ }
};

obj = new Proxy(obj, {  
    get(target, key, proxy) {
        return function(...args) {
            const id = args[0];
            let isEnroute = checkEnroute(id);
            let isDownloading = checkStatus(id);      
            let cached = getCached(id);

            if (isEnroute || isDownloading) {
                return false;
            }
            if (cached) {
                return cached;
            }
            return Reflect.apply(target[key], target, args);
        }
    }
});
```

以上我们可以看出，`Proxy`对于对象的代理作用很大，可以只对外展示我们允许展示的内容，比如某些属性、某些方法了。
`Proxy`s属于元编程了，在框架编写中会用，当框架复杂度很高，封装的对象中肯定有一些内容是作为私有的，不能对外暴露，所以使用`Proxy`可以保证封装的对象的安全性和独立性。

即便不在框架中，在我们平时的开发任务中也可以用。比如封装数据库ORM，代理网络请求等等。

### 思考：Proxy和TypeScript的关联和区别

像是set()拦截，我们可以拦截值的类型是否符合我们的要求，比如必须是数值，才会set()操作成功。`Proxy`和`TypeScript`同样都可以做到。
**那他们的区别是什么呢？**
`Proxy`是类似“元编程”，而`TypeScript`是JavaScript类型的超集，它可以编译成JS。他们解决问题的层面不一样，
`TypeScript`是静态类型检查，在代码编译阶段就可以检测出来，IDE可以为我们报错；而`Proxy`可以提供动态类型检查，在运行时也能做到类型检查。

## Reflect

`Reflect` 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与proxy handlers的方法相同。`Reflect`不是一个函数对象，因此它是不可构造的。

### 描述
与大多数全局对象不同，`Reflect`不是一个构造函数。你不能将其与一个new运算符一起使用，或者将`Reflect`对象作为一个函数来调用。`Reflect`的所有属性和方法都是静态的（就像Math对象）。


### 方法
`Reflect`是内置对象，在浏览器控制台中输入Reflect查看：
![Reflect](https://user-gold-cdn.xitu.io/2020/4/28/171c003a5bee7a02?w=1226&h=612&f=png&s=135140)

`Reflect`对象提供以下静态函数，它们具有与处理器对象（也就是Proxy handle）方法相同的名称。这些方法中的一些与 Object 上的对应方法相同。

- Reflect.apply()
对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 Function.prototype.apply() 功能类似。
- Reflect.construct()
对构造函数进行 new 操作，相当于执行 new target(...args)。
- Reflect.defineProperty()
和 Object.defineProperty() 类似。
- Reflect.deleteProperty()
作为函数的delete操作符，相当于执行 delete target[name]。
- Reflect.enumerate()
该方法会返回一个包含有目标对象身上所有可枚举的自身字符串属性以及继承字符串属性的迭代器，for...in 操作遍历到的正是这些属性。
- Reflect.get()
获取对象身上某个属性的值，类似于 target[name]。
- Reflect.getOwnPropertyDescriptor()
类似于 Object.getOwnPropertyDescriptor()。
Reflect.getPrototypeOf()
类似于 Object.getPrototypeOf()。
Reflect.has()
判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。
Reflect.isExtensible()
类似于 Object.isExtensible().
Reflect.ownKeys()
返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 Object.keys(), 但不会受enumerable影响).
Reflect.preventExtensions()
类似于 Object.preventExtensions()。返回一个Boolean。
Reflect.set()
将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。
Reflect.setPrototypeOf()
类似于 Object.setPrototypeOf()。




参考链接：

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect

https://medium.com/@SylvainPV/type-safety-in-javascript-using-es6-proxies-eee8fbbbd600