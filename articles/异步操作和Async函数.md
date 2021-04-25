## Promise
## Generator函数
### 协程
传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。期中有一种叫做”协程”（coroutine），
意思是多个线程互相写作，完成异步任务。

协程有点像函数，又有点像线程。它的运行流程大致如下：

- 第一步，协程A开始执行。
- 第二步，协程A执行到一半，进入暂停，执行权转移到协程B
- 第三步，（一段时间后）协程B交还执行权。
- 第四步，协程A恢复执行。
上面流程的协程A，就是异步任务，因为它分成两段（或多段）执行。
举例来说，读取文件的协程写法如下：

```Javascript
function *asyncJob() {
  // 其他代码
    var f = yield readFile(fileA)
  // 其他代码
}
```
上面代码的函数asyncJob是一个协程，它的奥妙就在其中的yield命令。它表示执行到此处，执行权将
交给其他协程。也就是说，yield命令是异步两个阶段的分界线。

协程遇到yield命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大有点，就是代码的
写法非常像同步，如果去除yield命令，简直一模一样。

### Generator函数的概念
Generator函数的数据交换和错误处理
Generator函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，
使他可以作为异步编程的完整解决方案：函数体内外的数据叫唤和错误处理机制。

next方法返回值的value属性，是Generator函数向外输出数据，
next方法还可以接受参数，这是向Generator函数体内输入数据。

```Javascript

function* gen(x){
    var y = yield x +2;
    return y;
}

var g = gen(1);
g.next() //{ value: 3, done: false }
g.next(2) //{ value: 2, done: true }

```

上面代码中，第一个next方法的value属性，返回表达式x + 2的值（3）。
第二个next方法带有参数2，这个参数可以传入 Generator 函数，作为上个阶段异步任务的返回结果，被函数体内的变量y接收。因此，这一步的 value 属性，返回的就是2（变量y的值）。

Generator函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。

```Javascript

function* gen(x){
  try {
    var y = yield x + 2;
  } catch (e){
    console.log(e);
  }
  return y;
}

var g = gen(1);
g.next();
g.throw('出错了');
// 出错了
```
上面代码的最后一行，Generator函数体外，使用指针对象的throw方法抛出的错误，可以被函数体内的try …catch代码块捕获。
这意味着，出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的。

### 异步任务的封装
下面看看如何使用 Generator 函数，执行一个真实的异步任务。

```Javascript

var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

```

上面代码中，Generator函数封装了一个异步操作，该操作先读取一个远程接口，然后从JSON格式的数据解析信息。就像前面说过的，这段代码非常像同步操作，除了加上了yield命令。

执行这段代码的方法如下。

```Javascript

var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```

上面代码中，首先执行Generator函数，获取遍历器对象，然后使用next 方法（第二行），执行异步任务的第一阶段。由于Fetch模块返回的是一个Promise对象，因此要用then方法调用下一个next 方法。

可以看到，虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。

## Thunk函数
### 参数的求职策略
**争议**
Thunk函数早在上个世纪60年代就诞生了。
那时，编程语言刚放起步，计算机学家还在研究，编译器怎么写比较好。一个争论的焦点是”求值策略”，即函数的参数到底该
何时求值。

- 传值调用
- 传名调用
各有利弊，传值调用比较简单，但是对参数求值的时候，实际上还没用到这个参数，有可能造成性能损失。
现在的C语言采用的是传值调用。
传值调用有时候造成性能损失，所以有一些计算机科学家倾向于”传名调用”，即只在执行时求值。

Thunk函数的意义
传名调用有它存在的道理和实现，虽然现在C JavaScript使用的是传值调用，但是传名调用还是有一定的使用范围的。

编译器的”传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做Thunk函数。

```Javascript

function f(m){
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk){
  return thunk() * 2;
}
```
上面代码中，函数f的参数x + 5被一个函数替换了。凡是用到原参数的地方，对Thunk函数求值即可。

这就是Thunk函数的定义，它是”传名调用”的一种实现策略，用来替换某个表达式。

### JavaScript语言的Thunk函数
JavaScript语言是传值调用，它的Thunk函数含义有所不同。** 在JavaScript语言中，Thunk函数替换的不是表达式，而是多参数函数，
将其替换成单参数的版本，** 且只接受回调函数作为参数。

### Thunkify模块
生产环境大的转换器，建议使用Thunkify模块。

首先是安装。
```
$ npm install thunkify
使用方式如下。

var thunkify = require(‘thunkify’);
var fs = require(‘fs’);

var read = thunkify(fs.readFile);
read(‘package.json’)(function(err, str){
// …
});
```
Thunkify的源码与上一节那个简单的转换器非常像。
``` js
function thunkify(fn){
return function(){
var args = new Array(arguments.length);
var ctx = this;


for(var i = 0; i < args.length; ++i) {
  args[i] = arguments[i];
}

return function(done){
  var called;

  args.push(function(){
    if (called) return;
    called = true;
    done.apply(null, arguments);
  });

  try {
    fn.apply(ctx, args);
  } catch (err) {
    done(err);
  }
}
}
};
```

它的源码主要多了一个检查机制，变量called确保回调函数只运行一次。这样的设计与下文的Generator函数相关。请看下面的例子。

```js 
function f(a, b, callback){
var sum = a + b;
callback(sum);
callback(sum);
}

var ft = thunkify(f);
var print = console.log.bind(console);
ft(1, 2)(print);
// 3
```
上面代码中，由于thunkify只允许回调函数执行一次，所以只输出一行结果

### Generator函数的流程管理
Thunk函数现在可以用于Generator函数的自动流程管理

Geneerator函数可以自动执行。

```Javascript
function* gen() {
  // ***
}

var g = gen();
var res = g.next();

while(!res.done){
    console.log(res.value)
    res = g.next()
}
```

上面代码中，Generator函数gen会自动执行完所有步骤。

但是，这不适合异步操作。如果必须保证前一步执行完，才能执行后一步，上面的自动执行就不可行。这是，Thunk函数就能
派上用场。以读取文件为例。下面的Generator函数封装了两个异步操作。

```Javascript
var fs = require('fs');
var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);


var gen = function* (){
    var r1 = yield readFile('/etc/fstab');
    
}
```
### Thunk函数的自动流程管理
Thunk函数的真正的威力，在于可以自动执行Generator函数。下面就是一个基于Thunk函数的Generator执行器。

Thunk函数的Generator执行器。

```Javascript
function run(fn) {
    var gen = fn();
    function next(err,data) {
        var result = gen.next(data);
        if(result.done){
            return ;
        }
        result.value(next)
    }
}


function* g(){
    // ...
}

run(g)
```
上面代码的run函数，就是一个Generator函数的自动执行器。内部的next函数就是Thunk的回调函数。next函数先将指针
移到Generator函数的下一步（gen.next方法），然后判断Generator函数是否结束(result.done属性)，如果没结束，就将next
函数再传入Thunk函数（result.value）属性，否则就直接退出。

有了这个执行器，执行Generator函数方便多了。不管内部有多少个异步操作，直接把Generator函数传入run函数即可。当然，前提是
每一个异步操作，都要是Thunk函数，也就是说，跟在yield命令后面的必须是Thunk函数。

```Javascript
var g = function* () {
    var f1 = yield readFile('fileA')
    var f2 = yield readFile('fileB')
    // ...
    var fn = yield readFile('fileN')
}

run(g)
```
上面代码中，函数g封装了n个异步的读取文件操作，只要执行run函数，这些操作就会自动完成。这样一来，异步操作不仅可以写得像
同步操作，而且一行代码就可以执行。

Thunk函数并不是Generator函数自动执行的唯一方案。因为自动执行的关键是，必须有一种机制，自动控制Generator函数的流程，
接收和交还程序的执行权。回调函数可以做到这一点，Promise对象也可以做到这一点。

### co模块
基本用法
co模块用于Generator函数的自动执行。

#### co模块的原理
为什么co可以自动执行Generator函数？
前面说过，Generator就是一个异步操作的容器。它的自定执行需要一种机制，当异步操作有了结果，能够
自动交回执行权。

两种方法可以做到这一点。

回调函数。将异步操作包装成Thunk函数，在回调函数里面交回执行权。
Promise对象。将异步操作包装成Promise对象，用then方法交回执行权。
co模块其实就是将两种自动执行器（Thunk函数和Promise对象），包装成一个模块。使用co的前提条件是，
Generator函数的yield命令后面，只能是Thunk函数或Promise函数。

基于Promise对象的自动执行
还是沿用上面的例子。首先，把fs模块的readFile方法包装成一个Promise对象。

```Javascript
var fs = require('fs')
var readFile = function (fileName){
    return new Promise(function (resolve,reject){    
        fs.readFile(fileName, function(error, data){        
            if(error) return reject(error)
            resolve(data)
        })
    })  
}

var gen = function* (){
    var f1 = yield readFile('/etc/fstab')
    var f2 = yield readFile('/etc/shells')
    
    console.log(f1.toString())
    console.log(f2.toString())
}
```
然后，手动执行上面的Generator函数。

```Javascript
var g = gen();

g.next().value.then(function (data){
        g.next(data).value.then(function(data){
            g.next(data)
        })
})
```
手动执行其实就是用then方法，层层添加回调函数。理解了这一点，就可以写出一个自动执行器。

```Javascript
function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
}

run(gen);
```
上面代码中，只要Generator函数还没执行到最后一步，next函数就调用自身，以此实现自动执行。

#### co模块的源码
### async函数
含义
ES7提供了async函数，使得异步操作变得更加方便。async函数是什么？一句话，async函数就是Generator函数的语法糖。

前文有一个Generator函数，依次读取两个文件。

Javascript
var fs = require('fs');

var readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
写成async函数，就是下面这样。

Javascript

var asyncReadFile = async function (){
  var f1 = await readFile('/etc/fstab');
  var f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
一比较就会发现，async函数就是将Generator函数的星号（*）替换成async，将yield替换成await，仅此而已。

async 函数对Generator函数的改进，体现在以下四点。

内置执行器。Generator函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器。也就是说，
async 函数的执行，与普通函数一模一样，只要一行。
Javascript
var result = asyncReadFile();
上面的代码调用了asyncReadFile函数，然后它就会自动执行，输出最后结果，这完全不像Generator函数，
需要调用next方法，或者用co模块，才能得到真正执行，得到最后结果。

更好的语义。async和await，比起型号和yield，语义更清楚了。async表示函数里有异步操作，asait表示跟在
后面的表达式需要等待结果。
更广的适用性。co模块约定，yield命令后面只能是Thunk函数或Promise对象，而async函数的await命令后面，
可以是Promise对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。
返回值是Promise。async函数的返回值是Promise对象，这比Geneerator函数的返回值是Iterator对象
方便多了。你可以用then方法指定下一步的操作。
进一步说，async函数完全可以看作多个异步操作，包装成一个Promise对象，而await命令就是内部then命令的语法糖。

语法
async函数的语法规则总体上比较简单，难点是错误处理机制。

async函数返回一个Promise对象。
async函数内部return语句返回的值，会成为then方法中回调函数的参数。

Javascript
async function f(){ 
    return 'hello world';
}

f().then(v => console.log(v))
上面代码中，函数f内部return 命令返回的值，会被then方法回调函数接收到。

async函数内部抛出错误，会导致返回的Promise对象变成reject状态。抛出的错误对象会被catch方法回调函数接收到。

Javascript
async function f(){
    throw new Error('出错了')
}

f().then(v => console.log(v), e => console.log(e))

//Error: 出错了
async函数返回的Promise对象，必须等到内部所有await命令的Promise对象执行完，才会发生状态改变。

正常情况下，await命令后面是一个Promise对象。如果不是，会被转成一个立即resolve的Promise对象。

async函数的实现
async函数的实现，就是将Generator函数和自动执行器，包装在一个函数里。

Javascript
async function fn(args){
    // ...
}


//等同于

function fn(args){
    return spawn(function*() {
        // ...
    })
}
所有的async函数都可以写成上面的第二种形式，其中的spawn函数就是自动执行器。
下面给出spawn函数的实现，基本就是前文自动执行器的翻版。

Javascript
function spawn(){
    return new Promise(function (resolve, reject){
        var gen = genF();
        function step(nextF) {
            try{
                var next = nextF();
            } catch(e){
                return reject(e)
            }      
        }   

        if(next.done){
            return resolve(next.value)
        }   
        Promise.resolve(next.value).then(function (v){
            step(function () { return gen.next(v);});
        }, function (e){
            step(function (){ return gen.throw(e)})
        })
        step(function(){return gen.next(undefined);})
    })
}
async函数是非常新的语法功能，新到不属于ES6,而是属于ES7。目前，它仍处于提案阶段，但是转码器Babel
和regenerator都已经支持，转码后就能使用。

async 函数的用法
async函数返回一个Promise对象，可以使用then方法添加回调函数。当函数执行的时候，一旦遇到 await
就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。

下面是一个例子。

Javascript
async function getStockPriceByName(name) {
  var symbol = await getStockSymbol(name);
  var stockPrice = await getStockPrice(symbol);
  return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
  console.log(result);
});
上面代码是一个获取股票报价的函数，函数前面的async关键字，表明该函数内部有异步操作。调用该函数时，
会立即返回一个Promise对象。不过是pending状态的Promise,在then中才会是resolve状态的Promise.

Async函数有多种使用形式。

Javascript
// 函数声明
async function foo() {}

//函数表达式
const foo = async function (){}

//对象的方法
let obj = {async foo(){}}
obj.foo().then(...)

// Class的方法

class Storage{
    constructor() {
        this.cacchePromise = caches.opeen('avatars');
    }

    async getAvatar(name) {
        const cache = await this.cacchePromise;
        return cache.match('/avatars/${name}.jpg')
    }
}

const storage = new Storage();
storage.getAvatar('jake').then(..)


//箭头函数
const foo = async () => {}
注意点
第一点，await命令后面的Promise对象，运行结果可能是rejected，随意最好把await命令放在
try ... catch代码块中。

Javascript
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法

async function myFunction() {
  await somethingThatReturnsAPromise()
  .catch(function (err) {
    console.log(err);
  };
}
第二点，多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。

Javascript

let foo = await getFoo();
let bar = await getBar();
上面代码中，getFoo和getBar是两个独立的异步操作（即互不依赖），被写成继发关系。这样比较耗时，因为只有getFoo完成以后，才会执行getBar，完全可以让它们同时触发。

Javascript

// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
上面两种写法，getFoo和getBar都是同时触发，这样就会缩短程序的执行时间。

第三点，await命令只能用在async函数之中，如果用在普通函数，就会报错。

async function dbFuc(db) {
let docs = [{}, {}, {}];

// 报错
docs.forEach(function (doc) {
await db.post(doc);
});
}
上面代码会报错，因为await用在普通函数之中了。但是，如果将forEach方法的参数改成async函数，也有问题。

async function dbFuc(db) {
let docs = [{}, {}, {}];

// 可能得到错误结果
docs.forEach(async function (doc) {
await db.post(doc);
});
}
上面代码可能不会正常工作，原因是这时三个db.post操作将是并发执行，也就是同时执行，而不是继发执行。正确的写法是采用for循环。

Javascript

async function dbFuc(db) {
  let docs = [{}, {}, {}];

  for (let doc of docs) {
    await db.post(doc);
  }
}
如果确实希望多个请求并发执行，可以使用Promise.all方法。

async function dbFuc(db) {
let docs = [{}, {}, {}];
let promises = docs.map((doc) => db.post(doc));

let results = await Promise.all(promises);
console.log(results);
}

// 或者使用下面的写法

async function dbFuc(db) {
let docs = [{}, {}, {}];
let promises = docs.map((doc) => db.post(doc));

let results = [];
for (let promise of promises) {
results.push(await promise);
}
console.log(results);
}

ES6将await增加为保留字。使用这个词作为标识符，在ES5是合法的，在ES6将抛出SyntaxError。

与Promise、Generator的比较
Promise API（then catch等等）太多，操作本身的语义反而不容易看出来。

Generator函数语义比Promise写法更清晰，用户定义的操作全部都出现在spawn函数的内部。这个写法的问题
在于，必须有一个任务运行器，自动执行Generator函数，上面代码的spawn函数就是自动执行器，它返回一个Promise
对象，而且必须保证yield语句后面的表达式，必须返回一个Promise。

Async函数的实现最简洁，最符合语义，几乎没有语义不相关的代码。它将Generator写法中的自动执行器，改在语言层面提供，
不暴露给用户，因为代码量最少。如果使用Generator写法，自动执行器需要用户自己提供。

实例：按顺序完成异步操作

