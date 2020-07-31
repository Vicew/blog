---
title: 我不知道的JavaScript-对象和原型
date: 2020-07-31 15:48:2
tags: JavaScript
categories: JavaScript
---

如题，这是我第二次阅读《你不知道的JavaScript》，记录我所不知道的JavaScript和补充相关知识   （确实是我不太知道的）

## 属性设置和屏蔽

```js
var obj = {
    a:2
};

// 创建一个关联到 anotherObject 的对象
var myObject = Object.create( obj );

myObject.a = 3
```

看打印：

![属性设置的问题](http://blog.panxiandiao.com/20200731161238.png)

这里就发生了屏蔽，如果属性名 a 既出现在 myObject 中也出现在 myObject 的 [\[Prototype\]] 链上层，那
         么就会发生屏蔽。myObject 中包含的 a 属性会屏蔽原型链上层的所有 foo 属性，因为
         myObject.a 总是会选择原型链中最底层的 a 属性。

屏蔽比我们想象中更加复杂。下面我们分析一下如果 a 不直接存在于 myObject 中而是存在于原型链上层时 myObject.a = 3 会出现的三种情况。

1. 如果在 [[Prototype]] 链上层存在名为 foo 的普通数据访问属性（参见第 3 章）并且没
有被标记为只读（writable:false），那就会直接在 myObject 中添加一个名为 foo 的新
属性，它是屏蔽属性
2. 如果在 [[Prototype]] 链上层存在 foo，但是它被标记为只读（writable:false），那么
无法修改已有属性或者在 myObject 上创建屏蔽属性。如果运行在严格模式下，代码会
抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。
![不会屏蔽](http://blog.panxiandiao.com/20200731163825.png)
3. 如果在 [[Prototype]] 链上层存在 foo 并且它是一个 setter（参见第 3 章），那就一定会
调用这个 setter。foo 不会被添加到（或者说屏蔽于）myObject，也不会重新定义 foo 这
个 setter（但是吧，实验了一下感觉还是有点问题的，后续还要查下资料）。
![会添加到myObject](http://blog.panxiandiao.com/20200731165558.png)

大多数开发者都认为如果向 [[Prototype]] 链上层已经存在的属性（[[Put]]）赋值，就一
定会触发屏蔽，但是如你所见，三种情况中只有一种（第一种）是这样的

如果你希望在第二种和第三种情况下也屏蔽 foo，那就不能使用 = 操作符来赋值，而是使
用 Object.defineProperty(..)来向 myObject 添加 foo

有些情况下会隐式产生屏蔽，一定要当心。思考下面的代码：

```js
var anotherObject = {
a:2
};
var myObject = Object.create( anotherObject );
anotherObject.a; // 2
myObject.a; // 2
anotherObject.hasOwnProperty( "a" ); // true
myObject.hasOwnProperty( "a" ); // false
myObject.a++; // 隐式屏蔽！
anotherObject.a; // 2
myObject.a; // 3
myObject.hasOwnProperty( "a" ); // true
```

尽管 myObject.a++ 看起来应该（通过委托）查找并增加 anotherObject.a 属性，但是别忘
了 ++ 操作相当于 myObject.a = myObject.a + 1。因此 ++ 操作首先会通过 [[Prototype]]
查找属性 a 并从 anotherObject.a 获取当前属性值 2，然后给这个值加 1，接着用 [[Put]]
将值 3 赋给 myObject 中新建的屏蔽属性 a，天呐！

修改委托属性时一定要小心。如果想让 anotherObject.a 的值增加，唯一的办法是
anotherObject.a++

