# gulp实践

> Gulp是一个基于Node.js和npm构建的开源工具包。它用于自动化和简化前端Web开发中的重复任务。

本篇博客致力于打造一个前端开发工具，在繁复的工作中，能够偷得浮生半日闲。使用gulp，创建出一套属于h5的开发流程，提高效率。

### gulp使用

```shell
cnpm install gulp —save-dev
```

### gulp 4 命令



Gulp.src

.pipe

.dest()

gulp.parallel

### Gulp 3 VS gulp4的区别

> Gulp 4最大的变化就是你不能像以前那样传递一个依赖任务列表。

Gulp3，如果有一个任务A，B和C的列表，你想在一个序列中运行（确保A在B开始之前完成，而B在C开始之前完成），代码如下：

```javascript
gulp.task('a', function () {
  // Do something.
});
gulp.task('b', ['a'], function () {
  // Do some stuff.
});
gulp.task('c', ['b'], function () {
    // Do some more stuff.
});
```

在Gulp 4中，你不能再这样做了。你会得到以下错误：

```javascript
assert.js:85
  throw new assert.AssertionError({
  ^
AssertionError: Task function must be specified
    at Gulp.set [as _setTask] (/home/hope/web/node_modules/undertaker/lib/set-task.js:10:3)
    at Gulp.task (/home/hope/web/node_modules/undertaker/lib/task.js:13:8)
    at Object.<anonymous> (/home/hope/web/gulpfile.js:31:6)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
    at Function.Module._load (module.js:438:3)
    at Module.require (module.js:497:17)
```

不要用Gulp3的方式指定依赖任务，你需要使用gulp.series和gulp.parallel，因为gulp任务现在只有两个参数。

```javascript
gulp.series：按照顺序执行
gulp.paralle：可以并行计算
```

```javascript
gulp.task('my-tasks', gulp.series('a', 'b', 'c', function() {
  // Do something after a, b, and c are finished.
}));
```

```javascript
gulp.task('build', gulp.parallel('styles', 'scripts', 'images', function () {
  // Build the website.
}));
```

或者这样

```javascript
gulp.task('my-tasks', gulp.series('a', gulp.parallel('styles','scripts', 'images'), 'b', 'c', function() {
  // Do something after a, b, and c are finished.
}));
```

> 相关任务必须在被调用之前发生。



在Gulp 3中，可以让你的文件引用它们之前的任务，因为一切都是默认异步执行的。现在，您需要在依赖关系在您的gulp文件中定义之后放置调用依赖项的任务。否则，你会得到这样的错误：

```javascript
assert.js:85
  throw new assert.AssertionError({
  ^
AssertionError: Task never defined: serve
    at getFunction (/home/hope/web/node_modules/undertaker/lib/helpers/normalizeArgs.js:15:5)
    at arrayMap (/home/hope/web/node_modules/lodash.map/index.js:140:21)
    at map (/home/hope/web/node_modules/lodash.map/index.js:1836:10)
    at normalizeArgs (/home/hope/web/node_modules/undertaker/lib/helpers/normalizeArgs.js:19:10)
    at Gulp.series (/home/hope/web/node_modules/undertaker/lib/series.js:13:14)
    at Object.<anonymous> (/home/hope/web/gulpfile.js:41:27)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
```

**解决方法：使依赖任务在文件的底部。**

> gulp4中需要指定task结束
> gulp4中，必须告诉gulp我们的task任务已经完成了。gulp3中，我们不必要这么做，因为如果没有发出异步完成信号，那么当任务返回时，gulp会认为它已经完成了，gulp4中必须明确指出任务完成了。

```
[14:58:54] '<anonymous>' errored after 1.3 min
[14:58:54] TypeError: done is not a function
    at FSWatcher.<anonymous> (/home/hope/web/gulpfile.js:125:9)
    at emitTwo (events.js:106:13)
    at FSWatcher.emit (events.js:191:7)
    at FSWatcher.<anonymous> (/home/hope/web/node_modules/chokidar/index.js:191:15)
    at FSWatcher._emit (/home/hope/web/node_modules/chokidar/index.js:233:5)
    at FSWatcher.<anonymous> (/home/hope/web/node_modules/chokidar/lib/nodefs-handler.js:263:16)
    at FSReqWrap.oncomplete (fs.js:123:15)
[14:58:54] 'serve' errored after 1.35 min
[14:58:54] 'default' errored after 1.35 min

```



1. 使用回调函数作为您的任务的第一个参数，只需在完成时调用该函数。

```
gulp.task('clean', function(done) {
  del(['build]);
    done();
});
```

1. 告诉gulp任务完成的另一个常见方法是 **返回(return)** 一个流或者** Promise**：

```
gulp.task('minify:js', function() {
  return gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
});
gulp.task('message', function() {
  return new Promise(function(resolve, reject) {
    console.log("HTTP Server Started");
    resolve();
  });
});
```

> 浏览器同步刷新，而不是样式注入

我的Gulp 3文件没有问题，在HTML重建上进行刷新，并在CSS更改上进行闪电般的风格注入，但升级到Gulp 4后，浏览器现在会在CSS更改后重新加载。

- 需要以不同的方式做三件事。首先确保您将一个文件数组传递给Browsersync构造函数

```
var bsConfig = {
    server: 'build',
    files: [
        'build'
    ],
    open: false,
};

gulp.task('browserSync', function() {
    bs.init(bsConfig);
});
```

- 其次，如果你有任务bs.stream()结束styles，你可以删除它。
- 第三，当你想在你的开发服务器上进行实时风格注入时，你的watch和browserSync任务需要并行运行，而不是终止，就像这样：

```javascript
gulp.task('serve', gulp.series('build', gulp.parallel('watch', 'browserSync')));
```

### 参考

<https://www.jianshu.com/p/40b99bed3127>

