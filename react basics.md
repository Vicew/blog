---
title: react basics
date: 2021-03-22 23:16:38
tags: react
categories: react
---

![react this](http://blog.panxiandiao.com/20210327160134.png)

自定义传参react都会在最后追加一个参数，可接受event

## setState

- 不可变值（注意引用类型的方法, push, splice）

- 可能是异步更新（setTimeout、自定义DOM事件中是同步）

- 可能会被合并（setState传入对象会被合并，类似Object.assign。传入函数不会）

## 函数组件

- 纯函数 输入props 输出jsx

- 没有实例 没有生命周期 没有state

- 不能扩展其他方法

## 受控组件和非受控组件

受控：input value onChange, textarea value onChnage