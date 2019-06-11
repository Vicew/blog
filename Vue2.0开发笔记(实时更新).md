---
title: Vue2.0开发笔记(实时更新)
date: 2019-05-28 14:20:38
tags: Vue2.0
categories: Vue2.0
---

1. `index.html`添加`meta name="viewport"`标签,是移动端基本的一个设置，手机浏览器是把页面放在一个虚拟的“窗口”（viewport）中，通常这个虚拟的“窗口”（viewport）比屏幕宽，这样就不用把每个网页挤到很小的窗口中，也不会破坏没有针对手机浏览器优化的网页的布局，用户可以通过平移和缩放来看网页的不同部分。
2. 依赖项`"bable-runtime"`对`es`的语法进行转义,`"fastclick"`解决移动端点击按钮300毫秒延迟的问题，`"babel-polyfill"`对`es6`的`API`进行转义
3. `fastclick.attach(document.body)`就是让`body`下所有的按钮的点击都没有延时
4. 别名的配制
5. `router-link tag="div"`这个tag的意思是把和这个连接渲染成`div`，默认本来是`a`
6. 