---
title: map, filter, reduce 各自有什么作用？
date: 2019-06-02 21:31:39
tags: JavaScript
categories: JavaScript
---

这篇博客主要讲讲在`es6`中的数组操作方法的作用

## map

`map` 作用是生成一个新数组，遍历原数组，将每个元素拿出来做一些变换然后放入到新的数组中

```js
    [1, 2, 3].map(v => v + 1) // -> [2, 3, 4]
```

另外 `map` 的回调函数接受三个参数，分别是当前索引元素，索引，原数组

```js
    ['1','2','3'].map(parseInt(string, radix))
```

**因为`parseInt`方法最多接收两个参数，所以传入的值是元素和索引**

- 第一轮遍历 parseInt('1', 0) -> 1
- 第二轮遍历 parseInt('2', 1) -> NaN
- 第三轮遍历 parseInt('3', 2) -> NaN

## filter

`filter` 的作用也是生成一个新数组，在遍历数组的时候将返回值为 `true` 的元素放入新数组，我们可以利用这个函数删除一些不需要的元素

```js
    let array = [1, 2, 4, 6]
    let newArray = array.filter(item => item !== 6)
    console.log(newArray) // [1, 2, 4]
```

和 map 一样，filter 的回调函数也接受三个参数，用处也相同

## reduce

`reduce` 可以将数组中的元素通过回调函数最终转换为一个值

```js
arr.reduce(callback,[initialValue])
```

callback （执行数组中每个值的函数，包含四个参数）

1. previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
2. currentValue （数组中当前被处理的元素）
3. index （当前元素在数组中的索引）
4. array （调用 reduce 的数组）

initialValue （作为第一次调用 callback 的第一个参数）

```js
    var items = [10, 120, 1000];
    // our reducer function
    var reducer = function add(sumSoFar, item) { return sumSoFar + item; };
    // do the job
    var total = items.reduce(reducer, 0);
    console.log(total); // 1130
```

可以看出，`reduce`函数根据初始值`0`，不断的进行叠加，完成最简单的总和的实现。

`reduce`函数的返回结果类型和传入的初始值相同，上个实例中初始值为`number`类型，同理，初始值也可为`object`类型

```js
    var items = [10, 120, 1000];
    // our reducer function
    var reducer = function add(sumSoFar, item) {
      sumSoFar.sum = sumSoFar.sum + item;
      return sumSoFar;
    };
    // do the job
    var total = items.reduce(reducer, {sum: 0});
    console.log(total); // {sum:1130}
```

well done!

再来一个reduce的栗子叭，也是面试笔试经常会遇到的数组拍平

![reduce,...]](http://blog.panxiandiao.com//20191021142251.png)

用到了reduce,用到了扩展运算符，运用到了递归，是不是很高大上呢，嘿嘿