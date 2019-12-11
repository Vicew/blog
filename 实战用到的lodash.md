---
title: 实战用到的lodash
date: 2019-10-09 11:52:39
tags: JavaScript
categories: JavaScript
---

## _.pickBy

这边前端需要处理一个对象，便利里面所有的属性，如果属性为空则删除这个属性，最后传给后台

正常情况下，我们的做法是通过for in来便利对象里面的属性，然后属性为空我们通过delete删除，像这样

![low](http://blog.panxiandiao.com//20191009153747.png)

但是总感觉很low对不对

![pickBy](http://blog.panxiandiao.com//20191009140538.png)

创建一个对象，这个对象组成为从 object 中经 prop=>prop 判断为真值的属性。 箭头函数调用2个参数：(value, key)

## _.debounce

后调用

![后](http://blog.panxiandiao.com//20191211115107.png)

先调用的话两个配置项反一下就行

[详情](http://www.panxiandiao.com/2019/10/09/%E5%AE%9E%E6%88%98%E7%94%A8%E5%88%B0%E7%9A%84lodash/#more)

## _.throttle

先调用

![先](http://blog.panxiandiao.com//20191211115721.png)

先调用的话两个配置项反一下就行 可以来应对canvas的resize

[详情](http://www.panxiandiao.com/2019/10/09/%E5%AE%9E%E6%88%98%E7%94%A8%E5%88%B0%E7%9A%84lodash/#more)