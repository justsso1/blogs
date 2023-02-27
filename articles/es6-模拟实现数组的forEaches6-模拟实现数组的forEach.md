---
date: 2020.4.11
title: 模拟实现数组的forEach
categories:
- javascript
---

Javascript底层源码应该是用c/c++写的，并不是JS代码，所以只能是尽可能的模拟

先讲一下forEach的api用法：

forEach(function(currentValue, index, arr), thisArg)

forEach底层是用的最基本的for循环实现的：Javascript底层源码应该是用c/c++写的，并不是JS代码，所以只能是尽可能的模拟

先讲一下forEach的api用法：

forEach(function(currentValue, index, arr), thisArg)

forEach底层是用的最基本的for循环实现的：