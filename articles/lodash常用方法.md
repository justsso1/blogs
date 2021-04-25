---
2020.3.11
---
lodash常用方法
Object
_.get(object, path, [defaultValue])

根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。

添加版本
3.7.0

参数

object (Object): 要检索的对象。

path (Array|string): 要获取属性的路径。

[defaultValue] (*): 如果解析值是 undefined ，这值会被返回。

返回

(*): 返回解析的值。

例子

Javascript

var object = { 'a': [{ 'b': { 'c': 3 } }] };
 
_.get(object, 'a[0].b.c');
// => 3
 
_.get(object, ['a', '0', 'b', 'c']);
// => 3
 
_.get(object, 'a.b.c', 'default');
// => 'default'
Array
_.tail(array)

获取除了array数组第一个元素以外的全部元素。

添加版本
4.0.0

参数
array (Array): 要检索的数组。
返回
(Array): 返回 array 数组的切片（除了array数组第一个元素以外的全部元素）。

例子

Javascript
_.tail([1, 2, 3]);
// => [2, 3]
Util
_.flow([funcs])

创建一个函数。 返回的结果是调用提供函数的结果，this 会绑定到创建函数。 每一个连续调用，传入的参数都是前一个函数返回的结果。

添加版本
3.0.0

参数

[funcs] (…(Function|Function[])): 要调用的函数。

返回

(Function): 返回新的函数。

例子

Javascript

function square(n) {
  return n * n;
}
 
var addSquare = _.flow([_.add, square]);
addSquare(1, 2);
// => 9

