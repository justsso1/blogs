---
2020.3.15
---
Generator函数
简介
Generator函数是ES6提供的一种异步解决方案，语法行为与传统函数完全不同。
从语法上讲，Generator函数是一个状态机，封装了多个内部状态。
从形式上讲，Generator函数是一个普通函数，但是有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield语句，定义不同的内部状态
执行Generator函数会返回一个遍历器对象，
调用Generator函数后，该函数并不执行，返回的也不是函数运行的结果，而是一个指向内部状态的指针对象，也就是遍历器对象（Iterator Object）。

Generator.prototype.throw()
Generator函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在Generator函数体内捕获。
注意，不要混淆遍历器对象的throw方法和全局的throw命令。全局的throw命令只能被函数体外的catch语句捕获。

这种函数体内捕获错误的机制，大大方便了对错误的处理。多个yield语句，可以只用一个 try...catch代码来捕获错误。
如果使用回调函数的写法，想要捕获多个错误，就不得不为每个函数内部写一个错误处理语句，现在只在Generator函数内部写一次catch语句就可以了。

Generator函数体外抛出的错误，可以在函数体内捕获；反过来，Generator函数体内抛出的错误，也可以被函数体外的catch捕获。
一旦Generator执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。如果此后还调用next方法，将返回一个value属性等于undefined、done属性等于true的对象，即JavaScript引擎认为这个Generator已经运行结束了。

Generator.prototype.return()
Generator函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历Generator函数。

Javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
上面代码中，遍历器对象g调用return方法后，返回值的value属性就是return方法的参数foo。并且，Generator函数的遍历就终止了，返回值的done属性为true，以后再调用next方法，done属性总是返回true。

如果return方法调用时，不提供参数，则返回值的value属性为undefined。

如果Generator函数内部有try…finally代码块，那么return方法会推迟到finally代码块执行完再执行。

yield* 语句
在一个Generator函数里执行另一个Generator函数
yield** 后面的Generator函数（没有return语句时），等同于在Generator函数内部，部署一个for…of循环。
其实，yield*后面的Generator函数（没有return语句时），不过是for...of的一种简写形式，完全可以用后者替代前者。反之，则需要用`var value = yield iterator的形式获取return语句的值。 如果yield后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员。 实际上，任何数据结构只要有Iterator接口，就可以被yield`遍历。

任何数据结构，只要有Iterator接口，就可以被 yield*遍历。

如果被代理的Generator有return语句，那么就可以向代理它的Generator函数返回数据。

yield*命令可以很方便的取出嵌套数组的成员。

Javascript
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for(let x of iterTree(tree)) {
  console.log(x);
}
使用yield* 命令遍历完全二叉树。

Javascript


next 方法的参数
yield语句本身没有返回值，或者说总是返回undeefined.next方法可以带一个参数，该参数就会被当作上一个yield语句的返回值。

Javascript
function *f() {
  for (var i = 0; true, i++){
    var rest = yield i;
    if(rest){
        i = -1;
    }
  }
}


var g = f(); 
g.next()  //{value: 0, done: false}
g.next()  //{value: 1, done: false}
g.next(true)  //{value: 0, doneL false}
上面代码先定义了一个可以无限运行的Generator函数f，如果next方法没有参数，每次运行到yield语句，变量reset的值总是undefined。
当next方法带一个参数true时，当前的变量reset就被重置为这个参数（即true），因此i会等于-1，下一轮循环就会从-1开始递增。

这个功能有很重要的语法意义。Generator函数从暂停状态到恢复运行，它的上下文状态（context）是不变的。
通过next方法的参数，就有办法在Generator函数开始运行之后，继续向函数体内部注入值。也就是说，
可以在Generator函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

作为对象属性的Generator函数
如果一个对象的属性是Generator函数，可以简写成下面的形式。

Javascript

let obj = {
  * myGeneratorMethod() {
    //···
  }
};

//等价
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
Generator函数返回的总是遍历器对象，而不是this对象。这个遍历器是Generator函数的实例，也继承了Generator函数的prototype对象上的方法。

Generator函数不能跟new命令一起使用，会报错。

应用场景
异步操作的同步化表达
控制流管理
部署Iterator接口，本质上是一样的，都是遍历器
看作数据结构，确切的说，看作数组结构
因为Generator函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。
Javascript
function *doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
上面代码就是依次返回三个函数，但是由于使用了Generator函数，导致可以像处理数组那样，处理这三个返回的函数。

Javascript

for (task of doStuff()) {
  // task是一个函数，可以像回调函数那样使用它
}
实际上，如果用ES5表达，完全可以用数组模拟Generator的这种用法。

Javascript
function doStuff() {
  return [
    fs.readFile.bind(null, 'hello.txt'),
    fs.readFile.bind(null, 'world.txt'),
    fs.readFile.bind(null, 'and-such.txt')
  ];
}
上面的函数，可以用一模一样的for…of循环处理！两相一比较，就不难看出Generator使得数据或者操作，具备了类似数组的接口。