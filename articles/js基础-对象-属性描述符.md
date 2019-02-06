# js基础-对象-属性描述符

思考下面的代码：

```js
var myObject = { a:2};

Object.getOwnPropertyDescriptor( myObject, "a" );
// {
// value: 2,
// writable: true,
// enumerable: true,
// configurable: true // }
```

### Object.getOwnPropertyDescriptor()

### Object.defineProperty()

```js
var myObject = {};
Object.defineProperty( myObject, "a", 
    {
    value: 2,
    writable: false, // 不可写! configurable: true, enumerable: true
    }
);  
myObject.a = 3;
myObject.a; // 2
```

**configurable**
它的修改都是单向的，不可逆转的
**enumerable**
**writable**

## 混合对象“类”

### 类的机制

类构造函数属于类，而且通常和类同名。此外，构造函数大多需要用 new 来调，这样语言
引擎才知道你想要构造一个新的类实例。

### 类的继承

父类和子类
