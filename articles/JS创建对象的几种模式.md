# JS创建对象的几种模式

#### 创建对象

##### 工厂模式

工厂模式是软件工程领域一种广为人知的设计模式，这种模式抽象了创建具体对象的过程。

ECMAScript是没有类的概念的，所以开发人员就发明了一种函数，用函数来封装以特定接口创建对象的细节。

```javascript
function createPerson(name, age, job){
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

工厂模式虽然解决了创建
多个相似对象的问题，但却没有解决对象识别的问题(即怎样知道一个对象的类型)。

##### 构造函数模式

ECMAScript中有原生的构造函数可以用来创建特定类型的对象，比如Object、Array这样的原生构造函数。

但是我们还是创建自定义的构造函数，从而自定义的对象也就有了类型了，解决了工厂模式的问题。

```javascript
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

按照惯例，构造函数始终都应该以一个大写字母开头，而非构造函数则应该以一个小写字母开头。

要创建 `Person` 的新实例，必须使用 `new` 操作符。

以这种方式调用构造函数实际上会经历以下 4 个步骤: 

1. 创建一个新对象;

2. 将构造函数的作用域赋给新对象(因此 this 就指向了这个新对象);

3. 执行构造函数中的代码(为这个新对象添加属性);

4. 返回新对象。

   这也是 `new` 操作符所有的。

对象实例的 `constructor`属性最初是用来标识对象类型的。

对象检测类型，最有效的方法是 `instanceof`



Object 的每个实例都具有下列属性和方法。 

- constructor:保存着用于创建当前对象的函数。对于前面的例子而言，person1.constructor === Person





##### 原型模式

<u>理解原型对象</u>

<u>4.原型的动态性</u>

​	重写原型对象，会在prototype原型对象中手动创建constructor属性，值为构造函数。但是对象实例和原型对象之间的关系断了，对象实例的__ __proto__ __不会关联到重写的原型对象上的。	

​	如果重写原型对象，重写原型对象切断了现有原型与任何之前已经存在的对象实例之间的联系;对象实例们引用的仍然是最初的原型。

对象实例上的__ __proto__ __只和原型对象有关系，和构造函数没有关系。

<u>5.原生对象的原型</u>

<u>6.原型对象的问题</u>

原型模式的缺点：

1. 它省略了为构造函数传递初始化参数这一环节，结果所有实例在默认情况下都将取得相同的属性值
2. 原型模式的最大问题是由其共享的本性所导致的,对于包含引用类型的属性来说，就有很大的问题了。

实例一般都有 属于自己的全部属性的，所以很少有人单独使用原型模式的。

##### 组合使用构造函数模式和原型模式

这是最常见的创建自定义类型的方式。

使用构造函数模式，用于定义实例属性；而原型模式用于定义方法和共享的属性。最大限度节约内存，集两种模式之长。

```javascript
function Person(name, age, job){
	this.name = name; 3 this.age = age;
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
alert(person1.friends);    //"Shelby,Count,Van"
alert(person2.friends);    //"Shelby,Count"
alert(person1.friends === person2.friends);  //false
alert(person1.sayName === person2.sayName);  //true
```

在这个例子中，实例属性都是在构造函数中定义的，而由所有实例共享的属性 constructor 和方
法 sayName()则是在原型中定义的。而修改了 person1.friends(向其中添加一个新字符串)，并不
会影响到 person2.friends，因为它们分别引用了不同的数组。

这种构造函数与原型混成的模式，是目前在ECMAScript中使用最广泛的、认同度最高的一种创建自定义类型的方法。这是用来定义引用类型的一种默认模式。

##### 动态原型模式

​	动态原型模式是把所有信息都封装在了构造函数中，而通过在构造函数中初始化原型，又保持了同时使用构造函数和原型的优点。

```javascript
function Person(name, age, job){
	//属性
	this.name = name; 
    this.age = age; 
    this.job = job;
    
    //方法
    if(typeof this.sayName != 'function'){
       Person.prototype.sayName = function() {
        	alert(this.name);
    	}
    }
}
    
```

<u>使用动态原型模式时，不能使用对象字面量重写原型。前面已经解释过了，如果</u>
<u>在已经创建了实例的情况下重写原型，那么就会切断现有实例与新原型之间的联系。</u>



##### 寄生构造函数模式

##### 稳妥构造函数模式

