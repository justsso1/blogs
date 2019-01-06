# gulp打包工具的使用

## 前提

node 和 npm 环境

## 安装

全局安装gulp, `npm install -g gulp`, 输入`gulp -v`,显示版本号则表示安装成功。

## 自动化设置

gulpfile.js 文件，任何导出的函数都将注册到gulp的任务系统中。

- gulp.task(),设置任务
- gulp.src(),读取文件，输出文件流
- gulp.dest(),将文件流写入地址
- .pipe(),文件流管道
- gulp --tasks,列出所有的任务

## 开始

**拆分gulpfile.js**

许多用户首先将所有逻辑添加到gulpfile。如果它变得太大，它可以重构为单独的文件。

每个任务都可以拆分成自己的文件，然后导入到gulpfile中进行合成。这不仅可以保持组织有序，而且可以让您独立测试每个任务或根据条件改变组成。

根据node 模块，可以将一个文件夹命名为gulpfile.js,然后下面有index.js。这样相当于原来的gulpfile.js文件。

任何被export出的函数，都会被注册到gulp任务系统中。

## 创建任务

每一个gulp任务都是异步的函数，允许错误首先返回，或者返回一个流，promise,event emitter, child process, or observable

一个任务可以被认为是public或者 private.

**公共任务和私有任务**

> Public tasks

gulpfile中 exports的任务作为共有任务，可以使用gulp命令行运行
> Private tasks
内部使用的命令，通常用作`series()` 和  `parallel()`组合

**组合任务** [官网地址](https://gulpjs.com/docs/en/getting-started/creating-tasks)

Gulp提供两种强有力的和方式，`series`和`parallel`，允许单个任务被组合成一个大的可操作的。`series`和`parallel`两种方法都接受任意数量的任务函数或组合操作。series()并且parallel()可以嵌套在自己内部或彼此嵌套到任何深度。

series(),是同步任务，它包含的任务顺序的去执行。

parallel，是异步任务，它包含的任务是并发进行的。

当`series()` or `parallel()`被调用时，任务立刻被组合起来.每一个任务被引用到的时候都会执行一遍。
任务和任务不要互相引用，要使用`series()`和`parallel()`组合起来。

## 异步完成

无论是哪种方式，都会被处理为异步。
**单一任务完成**

组合任务使用了`series()`，当出现error时，后面的任务都不能执行。

组合任务使用了`parallel()`，当出现error时，后面的任务可能完成也可能不完成。

**返回 stream**
``` JS
const { src, dest } = require('gulp');

function streamTask() {
  return src('*.js')
    .pipe(dest('output'));
}

exports.default = streamTask;
```

**返回promise**
``` js 
function promiseTask() {
  return Promise.resolve('the value is ignored');
}

exports.default = promiseTask;
```

**返回 child process**

``` js
function childProcessTask(){
    return exec('date', function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
        }
        console.log('Child Process STDOUT: ' + stdout);
    })
}

exports.build = series(clean, parallel(css, javascript));
exports.default = childProcessTask;
```



## 常用插件

**功能篇**

- 压缩图片 ,gulp-imagemin
- 压缩js ,gulp-uglify
- 压缩 css , clean-css
  
**优化篇**

- 编译sass  gulp-sass
- css优化器 [gulp-clean-css](https://github.com/jakubpawlowicz/clean-css#compatibility-modes)
- 支持高级js语法 gulp-babel

**效率篇**

- 自动刷新
- 添加版本，防止缓存

## 例子

**gulp-clean-css**
``` js
gulp.task('clean-css', function () {
    gulp.src('css/*.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({compatibility: 'ie8', debug: true}, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
            console.dir(details)
            // { stats:
            // { efficiency: 0.19161676646706582,
            //     minifiedSize: 405,
            //     originalSize: 501,
            //     timeSpent: 2 },
            //     errors: [],
            //         warnings: [],
            //     path: '/Users/ssojust/WebstormProjects/gulp-demo/css/b.css',
            //     name: '/b.css' }
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'))
});
```

最好看官网文档
