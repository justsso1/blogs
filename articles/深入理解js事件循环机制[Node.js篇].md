在[浏览器篇](http://lynnelv.github.io/js-event-loop-browser)已经对事件循环机制和一些相关的概念作了详细介绍，但主要是针对浏览器端的研究，Node环境是否也一样呢？先看一个demo：

```javascript
setTimeout(()=>{
    console.log('timer1')

    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)

setTimeout(()=>{
    console.log('timer2')

    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)
```

肉眼编译运行一下，蒽，在浏览器的结果就是下面这个了，道理都懂，就不累述了。

```shell
timer1
promise1
timer2
promise2
```

那么Node下执行看看，咦。。。奇怪，跟浏览器的运行结果并不一样~

```shell
timer1
timer2
promise1
promise2
```

例子说明，浏览器和 Node.js 的事件循环机制是有区别的，一起来看个究竟吧~

## Node.js的事件处理

[Node.js](https://en.wikipedia.org/wiki/Node.js)采用V8作为js的解析引擎，而I/O处理方面使用了自己设计的libuv，libuv是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的API，事件循环机制也是它里面的实现，[核心源码参考](https://github.com/libuv/libuv/blob/v1.x/src/unix/core.c#L348-L397)：

```c++
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  int timeout;
  int r;
  int ran_pending;

  r = uv__loop_alive(loop);
  if (!r)
    uv__update_time(loop);

  while (r != 0 && loop->stop_flag == 0) {
    uv__update_time(loop);
    // timers阶段
    uv__run_timers(loop);
    // I/O callbacks阶段
    ran_pending = uv__run_pending(loop);
    // idle阶段
    uv__run_idle(loop);
    // prepare阶段
    uv__run_prepare(loop);

    timeout = 0;
    if ((mode == UV_RUN_ONCE && !ran_pending) || mode == UV_RUN_DEFAULT)
      timeout = uv_backend_timeout(loop);
    // poll阶段
    uv__io_poll(loop, timeout);
    // check阶段
    uv__run_check(loop);
    // close callbacks阶段
    uv__run_closing_handles(loop);

    if (mode == UV_RUN_ONCE) {
      uv__update_time(loop);
      uv__run_timers(loop);
    }

    r = uv__loop_alive(loop);
    if (mode == UV_RUN_ONCE || mode == UV_RUN_NOWAIT)
      break;
  }

  if (loop->stop_flag != 0)
    loop->stop_flag = 0;

  return r;
}
```

根据[Node.js](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)官方介绍，每次事件循环都包含了6个阶段，对应到 libuv 源码中的实现，如下图所示

![](/Users/ssojust/gitproject/blogs/imgs/event_loop/node-libuv.png)

- **timers 阶段**：这个阶段执行timer（`setTimeout`、`setInterval`）的回调
- **I/O callbacks 阶段**：执行一些系统调用错误，比如网络通信的错误回调
- **idle, prepare 阶段**：仅node内部使用
- **poll 阶段**：获取新的I/O事件, 适当的条件下node将阻塞在这里
- **check 阶段**：执行 `setImmediate()` 的回调
- **close callbacks 阶段**：执行 `socket` 的 `close` 事件回调

我们重点看`timers`、`poll`、`check`这3个阶段就好，因为日常开发中的绝大部分异步任务都是在这3个阶段处理的。

### timers 阶段

timers 是事件循环的第一个阶段，Node 会去检查有无已过期的timer，如果有则把它的回调压入timer的任务队列中等待执行，事实上，Node 并不能保证timer在预设时间到了就会立即执行，因为Node对timer的过期检查不一定靠谱，它会受机器上其它运行程序影响，或者那个时间点主线程不空闲。比如下面的代码，`setTimeout()` 和 `setImmediate()` 的执行顺序是不确定的。

```javascript
setTimeout(() => {
  console.log('timeout')
}, 0)

setImmediate(() => {
  console.log('immediate')
})
```

但是把它们放到一个I/O回调里面，就一定是 `setImmediate()` 先执行，因为poll阶段后面就是check阶段。

### poll 阶段

poll 阶段主要有2个功能：

- 处理 poll 队列的事件
- 当有已超时的 timer，执行它的回调函数

even loop将同步执行poll队列里的回调，直到队列为空或执行的回调达到系统上限（上限具体多少未详），接下来even loop会去检查有无预设的`setImmediate()`，分两种情况：

1. 若有预设的`setImmediate()`, event loop将结束poll阶段进入check阶段，并执行check阶段的任务队列
2. 若没有预设的`setImmediate()`，event loop将阻塞在该阶段等待

注意一个细节，没有`setImmediate()`会导致event loop阻塞在poll阶段，这样之前设置的timer岂不是执行不了了？所以咧，在poll阶段event loop会有一个检查机制，检查timer队列是否为空，如果timer队列非空，event loop就开始下一轮事件循环，即重新进入到timer阶段。

### check 阶段

`setImmediate()`的回调会被加入check队列中， 从event loop的阶段图可以知道，check阶段的执行顺序在poll阶段之后。

## 小结

- event loop 的每个阶段都有一个任务队列
- 当 event loop 到达某个阶段时，将执行该阶段的任务队列，直到队列清空或执行的回调达到系统上限后，才会转入下一个阶段
- 当所有阶段被顺序执行一次后，称 event loop 完成了一个 tick

讲得好有道理，可是没有demo我还是理解不全啊，憋急，now！

```javascript
const fs = require('fs')

fs.readFile('test.txt', () => {
  console.log('readFile')
  setTimeout(() => {
    console.log('timeout')
  }, 0)
  setImmediate(() => {
    console.log('immediate')
  })
})
```

执行结果应该都没有疑问了

```shell
readFile
immediate
timeout
```

## Node.js 与浏览器的 Event Loop 差异

回顾上一篇，浏览器环境下，`microtask`的任务队列是每个`macrotask`执行完之后执行。

![](/Users/ssojust/gitproject/blogs/imgs/event_loop/ma(i)crotask.png)

而在Node.js中，`microtask`会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行`microtask`队列的任务。

![](/Users/ssojust/gitproject/blogs/imgs/event_loop/ma(i)crotask-in-node.png)

## demo回顾

回顾文章最开始的demo，全局脚本（main()）执行，将2个timer依次放入timer队列，main()执行完毕，调用栈空闲，任务队列开始执行；

![](/Users/ssojust/gitproject/blogs/imgs/event_loop/node-excute-animate.gif)

首先进入timers阶段，执行timer1的回调函数，打印`timer1`，并将promise1.then回调放入microtask队列，同样的步骤执行timer2，打印`timer2`；

至此，timer阶段执行结束，event loop进入下一个阶段之前，执行`microtask`队列的所有任务，依次打印`promise1`、`promise2`。

对比浏览器端的处理过程：

![](/Users/ssojust/gitproject/blogs/imgs/event_loop/browser-excute-animate.gif)

### process.nextTick() VS setImmediate()

> In essence, the names should be swapped. process.nextTick() fires more immediately than setImmediate()

来自官方文档有意思的一句话，从语义角度看，`setImmediate()` 应该比 `process.nextTick()` 先执行才对，而事实相反，命名是历史原因也很难再变。

`process.nextTick()` 会在各个事件阶段之间执行，一旦执行，要直到nextTick队列被清空，才会进入到下一个事件阶段，所以如果递归调用 `process.nextTick()`，会导致出现I/O starving（饥饿）的问题，比如下面例子的readFile已经完成，但它的回调一直无法执行：

```javascript
const fs = require('fs')
const starttime = Date.now()
let endtime

fs.readFile('text.txt', () => {
  endtime = Date.now()
  console.log('finish reading time: ', endtime - starttime)
})

let index = 0

function handler () {
  if (index++ >= 1000) return
  console.log(`nextTick ${index}`)
  process.nextTick(handler)
  // console.log(`setImmediate ${index}`)
  // setImmediate(handler)
}

handler()
```

`process.nextTick()`的运行结果：

```shell
nextTick 1
nextTick 2
......
nextTick 999
nextTick 1000
finish reading time: 170
```

替换成`setImmediate()`，运行结果：

```shell
setImmediate 1
setImmediate 2
finish reading time: 80
......
setImmediate 999
setImmediate 1000
```

这是因为嵌套调用的 `setImmediate()` 回调，被排到了下一次event loop才执行，所以不会出现阻塞。

## 总结

1. Node.js 的事件循环分为6个阶段

2. 浏览器和Node 环境下，

   ```
   microtask
   ```

    

   任务队列的执行时机不同

   - Node.js中，`microtask` 在事件循环的各个阶段之间执行
   - 浏览器端，`microtask` 在事件循环的 `macrotask` 执行完之后执行

3. 递归的调用`process.nextTick()`会导致I/O starving，官方推荐使用`setImmediate()`

[参考资料]

1. [event-loop-timers-and-nexttick](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
2. [Node.js Event Loop 的理解 Timers，process.nextTick()](https://cnodejs.org/topic/57d68794cb6f605d360105bf)
3. [libuv/core.c](https://github.com/libuv/libuv/blob/v1.x/src/unix/core.c)
4. [nodejs/next_tick.js](https://github.com/nodejs/node/blob/master/lib/internal/process/next_tick.js)
5. [深入理解js事件循环机制（浏览器篇）](http://lynnelv.github.io/js-event-loop-browser)