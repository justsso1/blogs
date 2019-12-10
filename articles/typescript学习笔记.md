- 类型系统可在编译阶段发现大部分的错误；
- 类型系统也是一个很直观的编程文档，可以查看任何函数或API的输入输出类型；

使用前的准备

`cnpm i typescript -g`  安装typescript的编译器tsp

`tsc -h`

`tsc --init` 创建`tsconfig.json` 文件

编译某个文件： `tsc ts文件路径`即可

： 是类型注解，类型注解在TypeScript中是记录函数或变量约束的简便方法。ts可以基于代码和类型注解做静态分析。

 也可以利用官网的`playground`来看编译后的结果

类和接口的良好配合，决定了一个程序员的抽象水平。

`npm install webpack webpack-cli webpack-dev-server`，安装	`webpack`，使用`webpack`作为构建工具写`typescript`

### 基本类型

#### ES6的6种基本类型

String

Number

Boolean

undefined

null

Symbol

#### ES6的3种引用类型

Array Function Object

#### Typescript的基本数据类型

String 

Number 

Boolean 

undefined 

null 

Symbol

Void 

any ： 兼容js 

Nerver

元组：限定数组的类型和个数

枚举

高级类型

#### Typescript的引用类型

#### 类型注解

作用： 相当于强类型语言中的类型shengming

语法： （变量/函数）: type

| 叫做联合类型，可以为多种类型    

#### 枚举类型

枚举： 一组有名字的常量集合。

枚举成员的值是只读的。

将程序中不容易记忆的硬编码提取出来，使用枚举，提高程序的可维护性

### typescript 接口  interface

#### 接口是什么： 

**定义：**接口用来描述对象、函数、以及类的结构和类型。

只要传入的对象满足接口的必要条件，那么就是被允许的，即使传入多余的属性也是可以通过检查的。

接口会对值所具有的结构进行类型检查，
接口代表了一种类型，会对值的类型有一个检查的。类型检查器不会去检查属性的顺序，只要相应的属性
存在并且类型也是对的就ok

**类型断言**是用来绕过类型检查的，是程序员告诉编译器，知道这是什么类型。·

```typescript
render(
	data: [
	{
			id: 1,
			name: 'a'
	},
	{
			id: 2,
			name: 'b'
	}
	] as Resulr
})
```



#### 接口中的可选属性 ?:

#### 只读属性 readonly

#### 可索引的类型

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如`a[10]`或`ageMap["daniel"]`。可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。

```typescript
//可索引类型，描述对象索引的类型和相应索引的返回值类型
interface StringNumber {
    [index: number]: string,
}

let strArr : StringNumber = ['A','B'];
let myStr: string = strArr[1];
```

TypeScript支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。这是因为当使用 `number`来索引时，JavaScript会将它转换成`string`然后再去索引对象。 也就是说用 `100`（一个`number`）去索引等同于使用`"100"`（一个`string`）去索引，因此两者需要保持一致。

#### 函数类型

使用接口表示函数类型。

### ts中的函数

定义函数的方式： 

1. `function add1(x: number, y: number) {return x+y;}`

2.  函数类型. `let add2 : (x: number, y: number) => number`

3. 类型别名 `type add3 = (x: number, y: number) => number`

4. 接口可以定义函数 `interface add4 {(x: number, y: number): number }`

**可选参数 ？**， 可选参数必须位于必选参数之后

默认参数，在必选参数之后的默认参数可以不用传。在必选参数前，默认参数是不能省略的。

**函数重载**

函数名称相同，但是函数参数个数和类型不同，就叫函数重载。

ts的重载，先定义函数的声明。

```typescript
//函数类型声明
function addB(... rest: numbeer[]): number;
//函数类型声明
function addB(... rest: string[]): string;
  
function addB(... rest: any[]): any{
		if()
}
```

会查询重载的列表，从上往下匹配，如果第一个匹配就会执行。

### typescript类

es6引入了`class`	（类）这个概念，作为对象的模版。通过`class`	关键字，可以定义类。

我们可以像传统面向对象语言一样去创建一个类了。ts覆盖了es6的类， 同时又引入了其他的特性。

比较两者之间的不同。

ts为类的构造参数和成员属性都增加了类型注解`：`，

**1.类成员的属性都是实例属性，而类成员的方法都是类的prototype原型方法。**

**2.实例的属性必须有初始值或在狗仔函数中被初始化。**

**Extends 关键字继承**

派生类的构造函数中，必须调用`super()`，它会执行基类的构造函数。而且，在构造函数里访问 `this`的属性之前，我们 *一定*要调用 `super()`。 这个是TypeScript强制执行的一条重要规则。



子类可以重写父类的方法，调用哪一个方法取决于实例是什么类。



#####公共，私有与受保护的修饰符

1. 默认是public，对所有人都是可见的。

2. private，私有，只能被类本身调用，不能被类的实例调用或者子类调用。

如果给`constructor`	函数设置为`private`，那么这个类既不能被实例化，也不能被继承。

```typescript
class Dog2{
    //既不能被实例化，也不能被继承
    private constructor(name: string){
        this.name = name
    }
    name: string
}
```

当成员被声明为private的时候，我们就不能在声明它的类的外部访问。



3. protected，受保护成员，只能在类或子类中访问，而不能在类的实例中访问。

   构造函数被protected ，那么这个类是不能被直接实例化的， 只能被继承，相当于基类。



`protected`修饰符与 `private`修饰符的行为很相似，但有一点不同， `protected`成员在派生类中仍然可以访问。不能在类的外部直接访问，但是可以通过类的实例方法访问。

4. readonly 修饰符



除了类成员可以添加修饰符外，构造函数的参数也可以添加修饰符。作用： 将参数自动变成实例的参数

##### 存取器

set get

##### 静态属性 static

类的实例成员是仅当类被实例化的时候才会被初始化。静态属性存在在类本身上，而不是类的实例上。使用**类.**访问属性.

类的静态属性只能通过类名访问，不能通过实例访问，可以通过继承，让自类访问。

#### 抽象类（只能被继承，不能被实例化的类）

abstract 关键字

 抽象类中的普通方法，有具体实现的话，就可以做到方法的复用。

```typescript
abstract class Animal{
    //定义一个方法，有具体的实现，那么子类就不用实现了
    eat(){console.log('eat...')}
}

class Dog  extends Animal {
    constructor(name: string){
        super();
        this.name = name;

    }
    name: string
    run(){}
    static food: string = 'boolds'
}

let dog = new Dog('wangwang');
dog.run();
dog.eat(); //子类中直接使用抽象类的方法
```

抽象类中的抽象方法，只需要有函数的声明，没有函数体，函数体由子类实现。

#### 多态

抽象方法的好处是可以抽离出事物的共性，抽象方法在不同子类的实现就叫**多态**。

类的成员方法返回this，就可以实现**链式调用**了。

```typescript
// 链式调用

class Wordflow {
    step1(){
        return this;
    }

    step2(){ return this;}
}

new Wordflow().step1().step2()
```

在继承时，this可以表现为多态。 this既可以是父类型，也可以是子类型。

```typescript
class MyFlow extends Wordflow {
    next(){
        return this;
    }
}

new MyFlow().next().step1().next().step2()
```

### 类与接口的关系

#### 介绍

**TypeScript的核心原则之一是对值所具有的结构进行类型检查**。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

#### 接口初探

下面通过一个简单示例来观察接口是如何工作的：

```ts

```

类型检查器会查看`printLabel`的调用。 `printLabel`有一个参数，并要求这个对象参数有一个名为`label`类型为`string`的属性。 需要注意的是，我们传入的对象参数实际上会包含很多属性，但是编译器只会检查那些必需的属性是否存在，并且其类型是否匹配。 然而，有些时候TypeScript却并不会这么宽松，我们下面会稍做讲解。

下面我们重写上面的例子，这次使用接口来描述：必须包含一个`label`属性且类型为`string`：

```ts

```

`LabelledValue`接口就好比一个名字，用来描述上面例子里的要求。 它代表了有一个 `label`属性且类型为`string`的对象。 需要注意的是，我们在这里并不能像在其它语言里一样，说传给 `printLabel`的对象实现了这个接口。我们只会去关注值的外形。 只要传入的对象满足上面提到的必要条件，那么它就是被允许的。

还有一点值得提的是，类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。

#### 可选属性

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。 可选属性在应用“option bags”模式时很常用，即给函数传入的参数对象中只有部分属性赋值了。

下面是应用了“option bags”的例子：

```ts

```

带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个`?`符号。

可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误。 比如，我们故意将 `createSquare`里的`color`属性名拼错，就会得到一个错误提示：

```ts

```

#### 只读属性

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 `readonly`来指定只读属性:

```ts

```

你可以通过赋值一个对象字面量来构造一个`Point`。 赋值后， `x`和`y`再也不能被改变了。

```ts

```

TypeScript具有`ReadonlyArray<T>`类型，它与`Array<T>`相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：

```ts

```

上面代码的最后一行，可以看到就算把整个`ReadonlyArray`赋值到一个普通数组也是不可以的。 但是你可以用类型断言重写：

```ts

```

#### `readonly` vs `const`

最简单判断该用`readonly`还是`const`的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用`const`，若做为属性则使用`readonly`。

#### 额外的属性检查

我们在第一个例子里使用了接口，TypeScript让我们传入`{ size: number; label: string; }`到仅期望得到`{ label: string; }`的函数里。 我们已经学过了可选属性，并且知道他们在“option bags”模式里很有用。

然而，天真地将这两者结合的话就会像在JavaScript里那样搬起石头砸自己的脚。 比如，拿 `createSquare`例子来说：

```ts

```

注意传入`createSquare`的参数拼写为*colour*而不是`color`。 在JavaScript里，这会默默地失败。

你可能会争辩这个程序已经正确地类型化了，因为`width`属性是兼容的，不存在`color`属性，而且额外的`colour`属性是无意义的。

然而，TypeScript会认为这段代码可能存在bug。 对象字面量会被特殊对待而且会经过 *额外属性检查*，当将它们赋值给变量或作为参数传递的时候。 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。

```ts

```

绕开这些检查非常简单。 最简便的方法是使用类型断言：

```ts

```

然而，最佳的方式是能够添加一个字符串索引签名，前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性。 如果 `SquareConfig`带有上面定义的类型的`color`和`width`属性，并且*还会*带有任意数量的其它属性，那么我们可以这样定义它：

```ts

```

我们稍后会讲到索引签名，但在这我们要表示的是`SquareConfig`可以有任意数量的属性，并且只要它们不是`color`和`width`，那么就无所谓它们的类型是什么。

还有最后一种跳过这些检查的方式，这可能会让你感到惊讶，它就是将这个对象赋值给一个另一个变量： 因为`squareOptions`不会经过额外属性检查，所以编译器不会报错。

```ts

```

要留意，在像上面一样的简单代码里，你可能不应该去绕开这些检查。 对于包含方法和内部状态的复杂对象字面量来讲，你可能需要使用这些技巧，但是大部额外属性检查错误是真正的bug。 就是说你遇到了额外类型检查出的错误，比如“option bags”，你应该去审查一下你的类型声明。 在这里，如果支持传入 `color`或`colour`属性到`createSquare`，你应该修改`SquareConfig`定义来体现出这一点。

#### 函数类型

接口能够描述JavaScript中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型。

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

```ts

```

这样定义后，我们可以像使用其它接口一样使用这个函数类型的接口。 下例展示了如何创建一个函数类型的变量，并将一个同类型的函数赋值给这个变量。

```ts

```

对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。 比如，我们使用下面的代码重写上面的例子：

```ts

```

函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。 如果你不想指定类型，TypeScript的类型系统会推断出参数类型，因为函数直接赋值给了 `SearchFunc`类型变量。 函数的返回值类型是通过其返回值推断出来的（此例是 `false`和`true`）。 如果让这个函数返回数字或字符串，类型检查器会警告我们函数的返回值类型与`SearchFunc`接口中的定义不匹配。

```ts

```

#### 可索引的类型

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如`a[10]`或`ageMap["daniel"]`。 可索引类型具有一个 *索引签名*，它描述了对象索引的类型，还有相应的索引返回值类型。 让我们看一个例子：

```ts

```

上面例子里，我们定义了`StringArray`接口，它具有索引签名。 这个索引签名表示了当用 `number`去索引`StringArray`时会得到`string`类型的返回值。

TypeScript支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 `number`来索引时，JavaScript会将它转换成`string`然后再去索引对象。 也就是说用 `100`（一个`number`）去索引等同于使用`"100"`（一个`string`）去索引，因此两者需要保持一致。

```ts

```

字符串索引签名能够很好的描述`dictionary`模式，并且它们也会确保所有属性与其返回值类型相匹配。 因为字符串索引声明了 `obj.property`和`obj["property"]`两种形式都可以。 下面的例子里， `name`的类型与字符串索引类型不匹配，所以类型检查器给出一个错误提示：

```ts

```

最后，你可以将索引签名设置为只读，这样就防止了给索引赋值：

```ts

```

你不能设置`myArray[2]`，因为索引签名是只读的。

####  类类型

#### 实现接口

与C#或Java里接口的基本作用一样，TypeScript也能够用它来明确的强制一个类去符合某种契约。

```ts

```

你也可以在接口中描述一个方法，在类里实现它，如同下面的`setTime`方法一样：

```ts

```

接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。

#### 类静态部分与实例部分的区别

当你操作类和接口的时候，你要知道类是具有两个类型的：静态部分的类型和实例的类型。 你会注意到，当你用构造器签名去定义一个接口并试图定义一个类去实现这个接口时会得到一个错误：

```ts

```

这里因为当一个类实现了一个接口时，只对其实例部分进行类型检查。 constructor存在于类的静态部分，所以不在检查的范围内。

因此，我们应该直接操作类的静态部分。 看下面的例子，我们定义了两个接口， `ClockConstructor`为构造函数所用和`ClockInterface`为实例方法所用。 为了方便我们定义一个构造函数 `createClock`，它用传入的类型创建实例。

```ts

```

因为`createClock`的第一个参数是`ClockConstructor`类型，在`createClock(AnalogClock, 7, 32)`里，会检查`AnalogClock`是否符合构造函数签名。

#### 继承接口

和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。

```ts

```

一个接口可以继承多个接口，创建出多个接口的合成接口。

```ts

```

#### 混合类型

先前我们提过，接口能够描述JavaScript里丰富的类型。 因为JavaScript其动态灵活的特点，有时你会希望一个对象可以同时具有上面提到的多种类型。

一个例子就是，一个对象可以同时做为函数和对象使用，并带有额外的属性。

```ts

```

在使用JavaScript第三方库的时候，你可能需要像上面那样去完整地定义类型。

#### 接口继承类

当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private和protected成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

当你有一个庞大的继承结构时这很有用，但要指出的是你的代码只在子类拥有特定属性时起作用。 这个子类除了继承至基类外与基类没有任何关系。 例：

```ts

```

在上面的例子里，`SelectableControl`包含了`Control`的所有成员，包括私有成员`state`。 因为 `state`是私有成员，所以只能够是`Control`的子类们才能实现`SelectableControl`接口。 因为只有 `Control`的子类才能够拥有一个声明于`Control`的私有成员`state`，这对私有成员的兼容性是必需的。

在`Control`类内部，是允许通过`SelectableControl`的实例来访问私有成员`state`的。 实际上，`SelectableControl`接口和拥有`select`方法的`Control`类是一样的。 `Button`和`TextBox`类是`SelectableControl`的子类（因为它们都继承自`Control`并有`select`方法），但`Image`和`Location`类并不是这样的。



### 泛型

 泛型：不预先确定的数据类型，具体的类型在使用的时候才能确定。

使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。

```typescript
// T 作为类型变量，是一个变量，代表不确定的类型
function identity<T> (value: T): T {
    return value;
}
```

调用方式： 

```typescript
identity("hahah"); //利用ts的类型推断
```



```typescript
//使用泛型变量
function loggingIdentity <T> (arr: T[]) : T[] {
    console.log(arr.length)
    return arr;
}
```



#### 泛型类型。type

泛型可以定义一个函数，也可以定义一个函数类型。

泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面，像函数声明一样。用泛型来定义一个类型（泛型函数类型）

```typescript
//泛型定义函数
function log<T>(value: T): T{
    return value;
}

//使用泛型来定义一个函数类型
type Log  = <T> (value: T) => T
let myLog: Log = log
```



#### 泛型接口

```typescript
function getPeo<T>(value: T): T {
    return value
}


interface People {
    <T>(name: T):T
}

let o : People= getPeo

//----------

//约束了整个泛型所有的类型
interface People2<T>{
    <T>(name: T): T
}
//必须给泛型指定类型
let o2: People2<string> = getPeo

//或者额在泛型接口定义的时候指定一个默认值
// interface People2<T=string>{
//    <T>(name: T): T
//}
```



把泛型变量与函数的参数等同对待，是代表类型而不是值的类型

#### 泛型类

给类设置泛型，可以约束住类的所有成员，除了静态成员

```typescript
//泛型约束
 class Log2 <T> {
     run(value: T){  //如果设置成静态成员会报错
         console.log(value);
        return value;
     }
 }

 let log1 = new Log2<number> (); //实例化类的时候显示传入T的类型
 log1.run(1);
 log1.run('2');  //报错，不是number类型
```



#### 泛型约束

泛型T继承接口，泛型就会受到一定的约束。

```typescript
interface Length {
    length: number
}

function Log3<T extends Length>(value: T) : T {
    console.log(value , value.length)
    return value
}


```

泛型的好处

1. 函数和类可以轻松地支持多种类型，增强程序的扩展性

2. 不必写多条函数重载，冗长的联合类型声明，增强代码可读性

3. 灵活控制类型之间的约束

   

### TypeScript类型检查机制

定义：

TypeScript编译器在做类型检查时，所秉承的一些原则，以及表现出的一些行为。

作用：辅助开发，提高开发效率。

- 类型推断
- 类型兼容性
- 类型保护

#### 类型检查机制1. 类型推断

不需要指定变量的类型（函数返回值的类型），TypeScript可以根据某些规则自动地为其推断出一个类型。

https://www.tslang.cn/docs/handbook/type-inference.html

基础类型推断，发生在 初始化变量

第一种，从右向左，最佳通用类型

```typescript
let x = 3; //ts推断x为number类型

let c = (x = 1) => { x+ 1}
```



第二种，从左向右，上下文类型

发生在事件处理中

 ```typescript
window.onkeydown = (event: KeyboardEvent) => {
    console.log(event.charCode)
}
 ```



类型断言，程序员比ts更了解代码

```typescript
//类型断言
interface Foo {
    bar: number
}
let foo = {} as Foo;
foo.bar = 1;
```



类型断言要避免滥用，如果使用了断言，但是有的成员没有符合约定也不会报错。 

#### 类型检查机制2.类型兼容性（增加语言）

TypeScript里的类型兼容性是基于结构子类型的。

TypeScript的结构性子类型是根据JavaScript代码的典型的写法来设计的。因为JavaScript里广泛地使用匿名对象，例如函数表达式喝对象字面量，所以使用结构类型系统来描述这些类型比使用名义类型系统更好。



> 当一个类型Y可以被赋值给另一个类型X时，我们就可以说类型X兼容类型Y。
>
> X兼容Y： X（目标类型） = Y （源类型）

类型兼容性会广泛存在于接口、函数、类中。

<u>两个接口怎样兼容？</u>

```typescript
interface Named {
    name : string
}
let mm: Named;
let y = {name: 'hah', location: 'china'}
mm = y;
```

这里要检查`y`是否能赋值给`mm`，编译器检`mm`中的每个属性，看是否能在`y`中也找到对应属性。

**源类型必须具备目标类型的必要属性，就可以兼容。**

接口成员少的可以兼容成员多的。

<u>函数兼容</u>





函数参数双向协变



可选参数及剩余参数

本质上都是为js准备，js的规则很宽泛。

<u>函数重载</u>

对于有重载的函数，源函数的每个重载都要在目标函数上找到对应的函数签名。这确保了目标函数可以在所有源函数可调用的地方调用。

函数为参数



参数个数，目标参数的个数要多于源函数参数个数

<u>枚举</u>

枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举之间是不兼容的。



<u>泛型之间的兼容性</u>



**口诀：**

**结构之间兼容：成员少的兼容成员多的**

**函数之间兼容：参数多的兼容参数少的**



#### 类型检查机制3. 类型保护

4种类型保护

1. 用户自定义的类型保护

一旦检查过类型，就能在之后的每个额分支里清楚地知道某一个额变量的类型。

类型保护就是一些表达式，它们会在运行时检查以确保在某个作用域里的类型。 要定义一个类型保护，我们只要简单地定义一个函数，它的返回值是一个 *类型谓词*

```typescript
function isFish(petL Fish | Bird) : pet is Fish {
		return (<Fish>pet).swim !== undefined
}
```

在这个例子里， `pet is Fish`就是类型谓词。 谓词为 `parameterName is Type`这种形式， `parameterName`必须是来自于当前函数签名里的一个参数名。

每当使用一些变量调用 `isFish`时，TypeScript会将变量缩减为那个具体的类型，只要这个类型与变量的原始类型是兼容的。



```typescript
// 'swim' 和 'fly' 调用都没有问题了

if (isFish(pet)) {
    pet.swim();
}
else {
    pet.fly();
}
```



注意TypeScript不仅知道在 `if`分支里 `pet`是 `Fish`类型； 它还清楚在 `else`分支里，一定 *不是* `Fish`类型，一定是 `Bird`类型。



2. `typeof`类型保护

   TypeScript可以将`typeof`识别为一个类型保护，我们可以直接在代码里检查类型了。

   ```typescript
   function padLeft(value: string, padding: string | number) {
   		if(typeof padding === "number"){
         	return Array(padding + 1).join(" ")+ value;
       }
     if(typeof padding === "string") {
       return padding + value;
     }
     throw new Error(`Expected string or numbere, got '${padding}'`);
   }
   ```

   

   这些* `typeof`类型保护*只有两种形式能被识别： `typeof v === "typename"`和 `typeof v !== "typename"`， `"typename"`必须是 `"number"`， `"string"`， `"boolean"`或 `"symbol"`。 但是TypeScript并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型保护。

3. `instanceof`类型保护

类型保护区块



is 类型谓词

#### 可以为null的类型

TypeScript具有两种特殊的类型， `null`和 `undefined`，它们分别具有值null和undefined. 我们在[基础类型](./Basic Types.md)一节里已经做过简要说明。 默认情况下，类型检查器认为 `null`与 `undefined`可以赋值给任何类型。 `null`与 `undefined`是所有其它类型的一个有效值。 这也意味着，你阻止不了将它们赋值给其它类型，就算是你想要阻止这种情况也不行。

`--strictNullChecks`标记可以解决此错误：当你声明一个变量时，它不会自动地包含 `null`或 `undefined`。 你可以使用联合类型明确的包含它们：

```ts
let s = "foo";
s = null; // 错误, 'null'不能赋值给'string'
let sn: string | null = "bar";
sn = null; // 可以

sn = undefined; // error, 'undefined'不能赋值给'string | null'
```

注意，按照JavaScript的语义，TypeScript会把 `null`和 `undefined`区别对待。 `string | null`， `string | undefined`和 `string | undefined | null`是不同的类型。

##### 可选参数，和可选属性

可选参数，和可选属性会默认加上 | undefined 的。 打开strictNullChecks 选项，则声明一个变量的时候，不能被赋值null 或 undefiend 类型断言手动去除 null或undefiend。语法是添加 `！` 后缀 

#### 类型别名

`type`关键字

类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。

##### 接口 vs. 类型别名

像我们提到的，类型别名可以像接口一样；然而，仍有一些细微差别。其一，接口创建了一个新的名字，可以在其它任何地方使用。 类型别名并不创建新名字—比如，错误信息就不会使用别名。 在下面的示例代码里，在编译器中将鼠标悬停在 interfaced上，显示它返回的是 Interface，但悬停在 aliased上时，显示的却是对象字面量类型。 

另一个重要区别是类型别名不能被 extends和 implements（自己也不能 extends和 implements其它类型）。 因为 [软件中的对象应该对于扩展是开放的，但是对于修改是封闭的](https://en.wikipedia.org/wiki/Open/closed_principle)，你应该尽量去使用接口代替类型别名。另一方面，如果你无法通过接口来描述一个类型并且需要使用联合类型或元组类型，这时通常会使用类型别名。



### 高级类型

#### 高级类型1.交叉类型与联合类型

联合类型表示一个值可以是几种类型之一。 我们用竖线（ `|`）分隔每个类型，所以 `number | string | boolean`表示一个值可以是 `number`， `string`，或 `boolean`。

如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员。



#### 高级类型2.索引类型

#### 高级类型3.映射类型

#### 高级类型4.条件类型



