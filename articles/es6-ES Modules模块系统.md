---
2020.4.26
---

ES6 Module将每个文件作为一个模块，每个模块拥有自身的作用域。ES6 Module 会自动采用严格模式，

导出 export
在ES6 Module中使用export命令来导出模块。export有两种方式：

命名导出
默认导出
一个模块可以有多个命名导出。它有两种不同的写法：

Javascript

//写法一
export const name = 'jack';
export const add = function(a,b){return a+b}

//写法二
const name = 'jack';
const add = (a,b) => a+b
export {
    name,
    add
}
在使用命名导出时，可以通过as关键字对变量重命名。

Javascript
const name = 'jack';
const add = (a,b) => a+b
export {
    name,
    add as getSum
}
模块的默认导出只能有一个。如：

Javascript
export default {
    name: 'jack',
    add: function(a,b) {
      return a+b
    }
}
我们可以将export default理解为对外输出了一个名为default的变量，因此不需要像命名导出一样进行变量声明，直接导出值即可。

Javascript
// 导出字符串
export default 'This is lal.js'

// 导出 class
export default class{..}

//导出匿名函数
export default function(){..}
导入
导入对应着导出，也有两种方式。

导入带有命名导出的模块
Javascript
//lal.js

const name = 'jack';
const add = (a,b) => a+b
export {
    name,
    add
}
import {name, add} from './lal.js';
加载带有命名导出的模块时，import后面要跟一堆大括号来将导入的变量名包裹起来，并且这些变量名需要与导出的变量名完全一直。导入变量的效果相当于在当前作用域下声明了
这些变量（name 和add）,并且不可对其进行更改，也就是所有导入的变量都是只读的。

与命名导出类似，我们可以通过as关键字可以对导入的变量重命名。

Javascript
import {name, add as Sum} from './lal.js'
Sum(2,3)
整体导入 import * as A from ‘./a.js’

对于默认导出的导入
Javascript
//lal.js
export default {
    name: 'jack',
    add: function(a,b) {
      return a+b
    }
}

import A from './lal,js'
A.add(2,3)
对于默认导出来说，import后面直接跟变量名，并且这个名字可以自由指定（），它指代了lal.js中默认导出的。从原理上可以这样去处理：