# 手动实现new

### 什么是`new`函数

>  **new 运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。 ——（来自于MDN）
> 
 
```javascript

function myNew(){
let Con = [].shift.call(arguments);  // 取出传入的构造函数

    let obj = Object.create(Con.prototype); // 2、创建一个空的对象并链接到原型，obj 可以访问构造函数原型中的属性

    let res =  Con.apply(obj, arguments) // 绑定this，执行Con函数
    return res instanceof Object ? res : obj; // 优先返回构造函数中的返回追
}
```
实验

```javascript
function Person(name, age){
    this.name = name;
    this.age = age;
}
Person.prototype.say = function(){
    console.log("hello world", this.name)
}

let two = myNew(Person, "y", 20)
console.log(two, two.name, two.age) // Person { name: 'y', age: 20 } y 20
two.say() //hello world y

```
