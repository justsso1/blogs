# 深入理解js事件循环机制[浏览器篇]

Event Loop在浏览器下和Node js环境下各有一套规则。

众所周知，javascript是单线程语言。单线程是什么？单线程是指js引擎中负责解析执行js代码的线程只有一个（主线程）即每次只能做一件事。那单线程是怎么做到异步的呢？

js的任务分为 *同步* 和 *异步* 两种，它们的处理方式也不同，**同步任务**是直接在主线程上排队执行，**异步任务**则会被放到任务队列中，若有多个任务（异步任务）则要在任务队列中排队等待，任务队列类似一个缓冲区，任务下一步会被移到**调用栈**（call stack），然后主线程执行调用栈的任务。

单线程是指js引擎中负责解析执行js代码的线程只有一个（**主线程**），即每次只能做一件事，而我们知道一个ajax请求，主线程在等待它响应的同时是会去做其它事的，浏览器先在事件表注册ajax的回调函数，响应回来后回调函数被添加到任务队列中等待执行，不会造成线程阻塞，所以说js处理ajax请求的方式是异步的。

总而言之，检查调用栈是否为空，以及确定把哪个task加入调用栈的这个过程就是**事件循环**，而**js实现异步的核心就是事件循环**。

**事件循环机制是为了处理异步操作的行为，所以这里是的任务队列是存储异步操作完成之后的回掉函数的地方。 按异步操作的完成先后插入队列。**

因此setTime(fn, 0)就会及时插入队列，但不会立即执行。

### 调用栈和任务队列

顾名思义，调用栈是一个栈结构，函数调用会形成一个栈帧，帧中包含了当前执行函数的参数和局部变量等上下文信息，函数执行完后，它的执行上下文会从栈中弹出。

下图就是调用栈和任务队列的关系图

![](/Users/ssojust/gitproject/blogs/imgs/event_loop/callstack.png)

### 事件循环

关于事件循环，[HTML规范](https://www.w3.org/TR/html5/webappapis.html#event-loop)的介绍

> There must be at least one event loop per user agent, and at most one event loop per unit of related similar-origin browsing contexts.
> An event loop has one or more task queues.
> Each task is defined as coming from a specific task source.

从规范理解，浏览器至少有一个事件循环，一个事件循环至少有一个任务队列（macrotask），每个外任务都有自己的分组，浏览器会为不同的任务组设置优先级。

### macrotask & microtask

规范有提到两个概念，但没有详细介绍，查阅一些资料大概可总结如下：

> **macrotask**：包含执行整体的js代码，事件回调，XHR回调，定时器（setTimeout/setInterval/setImmediate），IO操作，UI render

> **microtask**：更新应用程序状态的任务，包括promise回调，MutationObserver，process.nextTick，Object.observe

其中`setImmediate`和`process.nextTick`是nodejs的实现，在[nodejs篇](http://lynnelv.github.io/js-event-loop-nodejs)会详细介绍。

### 事件处理过程

关于`macrotask`和`microtask`的理解，光这样看会有些晦涩难懂，结合事件循坏的机制理解清晰很多，下面这张图可以说是介绍得非常清楚了。

![](/Users/ssojust/gitproject/blogs/imgs/event_loop/event-loop.jpg)

总结起来，一次事件循环的步骤包括：

1. 检查macrotask队列是否为空，非空则到2，为空则到3
2. 执行macrotask中的一个任务
3. 继续检查microtask队列是否为空，若有则到4，否则到5
4. 取出microtask中的任务执行，执行完成返回到步骤3
5. 执行视图更新

### mactotask & microtask的执行顺序

![](/Users/ssojust/gitproject/blogs/imgs/event_loop/ma(i)crotask.png)

读完这么多干巴巴的概念介绍，还不如看一段代码感受下

```javascript
console.log('start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

Promise.resolve().then(function() {
  console.log('promise1')
}).then(function() {
  console.log('promise2')
})

console.log('end')
```

打印台输出的log顺序是什么？结合上述的步骤分析，系不系so easy~

![](/Users/ssojust/gitproject/blogs/imgs/event_loop/browser-deom1-excute-animate.gif)

首先，全局代码（main()）压入调用栈执行，打印`start`；

接下来setTimeout压入macrotask队列，promise.then回调放入microtask队列，最后执行console.log(‘end’)，打印出`end`；

至此，调用栈中的代码被执行完成，回顾macrotask的定义，我们知道全局代码属于macrotask，macrotask执行完，那接下来就是执行microtask队列的任务了，执行promise回调打印`promise1`；

promise回调函数默认返回undefined，promise状态变为fullfill触发接下来的then回调，继续压入microtask队列，**event loop会把当前的microtask队列一直执行完**，此时执行第二个promise.then回调打印出`promise2`；

这时microtask队列已经为空，从上面的流程图可以知道，接下来主线程会去做一些UI渲染工作（不一定会做），然后开始下一轮event loop，执行setTimeout的回调，打印出`setTimeout`；

这个过程会不断重复，也就是所谓的**事件循环**。

### 视图渲染的时机

回顾上面的事件循环示意图，update rendering（视图渲染）发生在本轮事件循环的microtask队列被执行完之后，也就是说执行任务的耗时会影响视图渲染的时机。通常浏览器以每秒60帧（60fps）的速率刷新页面，据说这个帧率最适合人眼交互，大概16.7ms渲染一帧，所以如果要让用户觉得顺畅，单个macrotask及它相关的所有microtask最好能在16.7ms内完成。

但也不是每轮事件循环都会执行视图更新，浏览器有自己的优化策略，例如把几次的视图更新累积到一起重绘，重绘之前会通知requestAnimationFrame执行回调函数，也就是说requestAnimationFrame回调的执行时机是在一次或多次事件循环的UI render阶段。

以下代码可以验证

```javascript
setTimeout(function() {console.log('timer1')}, 0)

requestAnimationFrame(function(){
	console.log('requestAnimationFrame')
})

setTimeout(function() {console.log('timer2')}, 0)

new Promise(function executor(resolve) {
	console.log('promise 1')
	resolve()
	console.log('promise 2')
}).then(function() {
	console.log('promise then')
})

console.log('end')
```

运行结果截图如下:

![](/Users/ssojust/gitproject/blogs/imgs/event_loop/requestAnimationFrame-run-result1.png)

可以看到，结果1中`requestAnimationFrame()`是在一次事件循环后执行，而在结果2，它的执行则是在三次事件循环结束后。

## 总结

1. 事件循环是js实现异步的核心

2. 每轮事件循环分为3个步骤：

   > a) 执行macrotask队列的一个任务
   > b) 执行完当前microtask队列的所有任务
   > c) UI render

3. 浏览器只保证requestAnimationFrame的回调在重绘之前执行，没有确定的时间，何时重绘由浏览器决定

[参考资料]

1. [event-loops](https://www.w3.org/TR/html5/webappapis.html#event-loops)
2. [sec-jobs-and-job-queues](http://ecma-international.org/ecma-262/6.0/#sec-jobs-and-job-queues)
3. [Promises/A+](https://promisesaplus.com/#notes)
4. [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly&utm_medium=email)
5. [HTML系列：macrotask和microtask](https://zhuanlan.zhihu.com/p/24460769)
6. [http://www.ruanyifeng.com/blog/2014/10/event-loop.html](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)