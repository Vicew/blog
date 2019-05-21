---
title: JS 闭包
date: 2019-05-21 12:34:39
tags: JavaScript
categories: JavaScript
---

## 什么是闭包

```js
    function A() {
    let a = 1
    B = function () {
        console.log(a)
    }
    }
    A()
    B() // 1
```