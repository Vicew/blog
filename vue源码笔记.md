---
title: Vue2.0源码笔记
date: 2019-10-02 21:23:38
tags: Vue2.0
categories: Vue2.0
---

## new vue发生了什么

`init.js initState` > `state.js initState initData`

首先拿到在data对象（推荐写成函数的形式）,是函数就转化对象赋值给vm._data，也就是挂载到vm下，不是对象的话就报警告，下面用object.keys来获得对象数组来和props中的对象数组做比较，因为这两个中的对象都是挂载到vm下的，重复了就报一个错，下去就到了最重要的proxy代理函数了，传入vm,_data,和转换过后的数组下标key，进行对应的set和get操作～～

## 实例挂载的实现

`entry-runtime-with-compiler.js`

![挂载mount](http://blog.panxiandiao.com//20191007160521.png)

把方法缓存到mount中并且重新定义$mount方法，缓存的方法是在`runtime index.js`中定义

![index](http://blog.panxiandiao.com//20191007160852.png)

为什么要在入口从新定义一遍这个函数，因为我们这个是compiler的版本，在`init.js`进行挂载的时候执行的就是入口的函数，only版本没有入口的那些逻辑，就是给only版本复用的，我们来看具体实现

传入参数可以是一个dom元素也可以是一个字符串，字符串的话就去执行`document.querySelector`都是获得一个dom对象，因为挂载是覆盖，所以下面判断不能直接挂载到html和body标签上。有模板用outerhtml拿到dom字符串 ，没有的话就在外面包一层div返回，编译相关后面讲。vue只认render函数，没有的话就把模板编译转换成render函数，然后执行$mount函数，执行mountComponent函数，only版本必须要render函数，vm._render()渲染vnode，hydrating服务端渲染,这个函数看new Watcher,把函数赋值给getter，执行get，在try中执行getter 。视图修改等等都会被监听到，然后重新执行mountComponent函数，执行了一次渲染，更新vnode等等。

## render

直接替换dom call中的renderProxy设置拦截器判断模版是否被定义

## virtual DOM

参考了snabbdom 函数柯里化数据驱动执行一次`patch:function`后再也不用判断属于哪种平台类型了 创建当前节点和子节点 最后挂载到父节点并且替换