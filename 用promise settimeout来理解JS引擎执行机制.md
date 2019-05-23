---
title: 用promise settimeout来理解JS引擎执行机制
date: 2019-05-23 11:43:38
tags: JavaScript
categories: JavaScript
---

在`JS`执行中都是单线程执行，所以代码的执行可以说是自上而下，如果前一段的代码出现问题，就会导致下一段代码无法执行，对于用户而言就是卡死现象，所以在`JS`执行机制引出了异步执行操作

## 做个热身

```js
    console.log('1');
    setTimeout(()=>{
        console.log('2');
    },0);
    console.log('3');
```

有点 `JS` 基础的同学会容易就知道了运行结果。

运行结果是：1、3、2

大家都知道`setTimeout`里的函数并没有立即执行，而是延迟一段时间，符合特定的条件才开始执行，这就是异步执行操作

**由此执行我们先了解到`JS`任务的执行分类为：同步任务和异步任务**

按照这种的分类方式JS的执行机制是：

首先，判断`JS`是同步还是异步，同步进入主线程，异步进入`Event table`

其次，异步任务在`Event table`中注册函数，当满足特定的条件，被推入`Event queue`(事件队列)

最后，同步任务进入主线程后一直执行，直到主线程空闲后，才会去`Event queue`中查看是否有可执行的异步任务，如果有就推入主线程中执行。

循环以上三步执行，这就是`Event loop`

所以上面的例子的执行顺序是

`console.log("1")`是同步任务，放入主线程

`setTimeout()`是异步任务，被放入`Event table`,`0`秒后被推入`Event queue`里

`console.log("3")`是同步任务，放入主线程

当`1、3`任务先执行完后，主线程去`Event queue`里查看是否有可执行的函数，执行`setTimeout`里的函数

接下来我们看这段代码

```js
    setTimeout(()=>{
    console.log('1');
    },0)
    new Promise(function(resolve){
        console.log('2');
        resolve(3)
    }).then(res=>{console.log(res)});
    console.log('4');
```

按照上面分析的思路分析这段代码

`setTimeout` 是异步任务,被放到`event table`

`new Promise` 是同步任务,被放到主进程里,直接执行打印 `console.log("2")`

`.then`里的函数是异步任务,被放到`event table`

`console.log('4')`是同步代码,被放到主进程里,直接执行

完全没问题，但是看看执行结果吧

![没想到吧](http://blog.panxiandiao.com/20190523121807.png)

没想到吧，不要着急，往下看

## 宏任务和微任务

事实上，我们刚刚按照异步同步的划分并不准确

而准确的方式应该是（优先级排列）：

- macro-task(宏任务)：`主代码块` > `setImmediate` > `MessageChannel` > `setTimeout` / `setInterval`
- micro-task(微任务)：`process.nextTick` > `Promise` > `MutationObserver`

不同类型的任务会进入不同的`Event Queue`，有宏任务的队列和微任务的队列

上一张偷来的图我们来分析上面的过程

![啦啦啦](http://blog.panxiandiao.com/20190523131322.png)

1. 整段代码作为宏任务进入主线程
2. 遇到`settimeout`，将其回调函数注册后分发到宏任务`Event Queue`
3. 遇到了`Promise`，`new Promise`立即执行，`then`函数分发到微任务`Event Queue`
4. 遇到console.log('4')，立即执行
5. 第一个宏任务执行结束，看看有什么微任务，发现有`then`，执行
6. 第二轮循环，发现宏任务`settimeout`的回调函数，执行
7. 结束

well done