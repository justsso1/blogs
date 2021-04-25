
---
2020.7.13
---
数组中的reduce犹如一只魔法棒，通过它可以做一些黑科技一样的事情。本文从api讲解到一般用法再到高级用法，由浅入深的讲一讲数组中的reduce。[MDN链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)



### Array.prototype.reduce
reduce的api是这样的，

> reduce(callback(accumulator, currentValue[, index, array])[,initialValue])

- Callback
    - accumulator 积累的值
    - currentValue 当前值
    -index 当前下标
    - array 当前数组
- initialValue 初始值

reduce接受两个参数，回调函数和初识值，初始值是可选的。回调函数接受4个参数：积累值、当前值、当前下标、当前数组。
如果reduce的参数只有一个，那么积累值一开始是数组中第一个值，如果reduce的参数有两个，那么积累值一开始是出入的initialValue初始值。
然后在每一次迭代时，返回的值作为下一次迭代的accumulator 积累值。

**重要说明：如果未设置initialValue，那么reduce将使用您的第一个数组值作为第一次迭代的accumulator，从第二个数组元素上开始循环，从index=1开始（如果有的话）**

以下是reduce的几种实际应用。

1. 将数组转化为对象

将下面的数组转成以id为key的对象。

```Javascript

const userList = [
    {
        id: 1,
        username: 'john',
        sex: 1,
        email: 'john@163.com'
    },
    {
        id: 2,
        username: 'jerry',
        sex: 1,
        email: 'jerry@163.com'
    },
    {
        id: 3,
        username: 'nancy',
        sex: 0,
        email: ''
    }
];

let objUserList = userList.reduce(keyByUserNameReducer, {})

function keyByUserNameReducer(acculumator, currentValue, currentIndex, array) {
    return {...acculumator, [currentValue.id]: currentValue}
}

console.log(objUserList)

// {
//    '1': { id: 1, username: 'john', sex: 1, email: 'john@163.com' },
//    '2': { id: 2, username: 'jerry', sex: 1, email: 'jerry@163.com' },
//    '3': { id: 3, username: 'nancy', sex: 0, email: '' }
// }
```

2. 将小数组展开成大数组
将下面数组按照逗号分割.

```Javascript
const fileLines = [
    'Inspector Algar,Inspector Bardle,Mr. Barker,Inspector Barton',
    'Inspector Baynes,Inspector Bradstreet,Inspector Sam Brown',
    'Monsieur Dubugue,Birdy Edwards,Inspector Forbes,Inspector Forrester',
    'Inspector Gregory,Inspector Tobias Gregson,Inspector Hill',
    'Inspector Stanley Hopkins,Inspector Athelney Jones'
];

let commaArray = fileLines.reduce(function (acculumator, currentValue, currentIndex, array) {
    return acculumator.concat(currentValue.split(/,/g))
}, [])
console.log(commaArray)
/*
[
    'Inspector Algar',
    'Inspector Bardle',
    'Mr. Barker',
    'Inspector Barton',
    'Inspector Baynes',
    'Inspector Bradstreet',
    'Inspector Sam Brown',
    'Monsieur Dubugue',
    'Birdy Edwards',
    'Inspector Forbes',
    'Inspector Forrester',
    'Inspector Gregory',
    'Inspector Tobias Gregson',
    'Inspector Hill',
    'Inspector Stanley Hopkins',
    'Inspector Athelney Jones'
  ]
*/
```

3. 用reduce实现flatMap

```Javascript

// 数组的flatMap
// flatMap的底层的操作：先使用map操作，然后对得到的数组仅展开一层再得到一个数组
const arr = ["今天天气不错", "", "早上好"];
let flatMapArr = arr.flatMap((item, index) => {
    return item.split("")
})
console.log(flatMapArr) // ['今', '天', '天','气', '不', '错','早', '上', '好']

// 使用数组的reduce实现数组的flatMap
let reduceFlatMap = arr.reduce(function (acculumator, currentValue, currentIndex, array) {
    return [...acculumator, ...currentValue.split('')]
}, [])
console.log(reduceFlatMap) // ['今', '天', '天','气', '不', '错','早', '上', '好']
```

4. 按顺序执行异步函数

根据userList数组的name属性去依次请求数据。

```Javascript

let asyncReducer = userList.reduce(async function (acculumator, currentValue, currentIndex, array) {
    const obj = await acculumator.then()
    let re = await new Promise((resolve, reject) => {
        // 用 setTimeout 模拟请求数组
        setTimeout(() => {
            resolve(`to=>${currentValue.username}`)
        }, 1000)
    })
    return {...obj, [currentValue.username]: re}

}, Promise.resolve({}))
asyncReducer.then(res => {
    console.log(res)
})

// 3s之后打印：
// { john: 'to=>john', jerry: 'to=>jerry', nancy: 'to=>nancy' }
```

### 总结：
- 记住在处理对象数组时要指定一个initialValue
- 数字数组使用reduce代码干净，请尽量不要把reduce函数过于复杂
- 不要忘记在回调函数中返回，否则最后得到的值将可能出现错误
- 回调函数的第三个参数index访问迭代次数
- reduce处理时会跳过数组空值