---
title: 如何正确判断 this？箭头函数的 this 是什么？
date: 2019-05-17 14:06:38
tags: JavaScript
categories: JavaScript
---

## 如何判断

我们先来看几个函数调用的场景

```js
    function foo() {
    console.log(this.a)
    }
    var a = 1
    foo()

    const obj = {
    a: 2,
    foo: foo
    }
    obj.foo()

    const c = new foo()
```

- 对于直接调用 `foo` 来说，不管 `foo` 函数被放在了什么地方，`this` 一定是 `window`
- 对于 `obj.foo()` 来说，我们只需要记住，谁调用了函数，谁就是 `this`，所以在这个场景下 `foo` 函数中的 `this` 就是 `obj` 对象
- 对于 `new` 的方式来说，`this` 被永远绑定在了 `c`上面，不会被任何方式改变 `this`

## 箭头函数 this 的不同

```js
    function a() {
    return () => {
        return () => {
        console.log(this)
        }
    }
    }
    console.log(a()()())
```

首先箭头函数其实是没有 `this` 的，箭头函数中的 `this` 只取决包裹箭头函数的第一个普通函数的 `this`。在这个例子中，因为包裹箭头函数的第一个普通函数是 `a`，所以此时的 `this` 是 `window`。另外对箭头函数使用 `bind` 这类函数是无效的

> bind()方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind()方法的第一个参数作为 this，传入 bind() 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

**在`Javascript`中，多次 `bind()` 是无效的。更深层次的原因， `bind()` 的实现，相当于使用函数在内部包了一个 `call / apply` ，第二次 `bind()` 相当于再包住第一次 `bind()` ,故第二次以后的 `bind` 是无法生效的**

## this 优先级判断

首先，`new` 的方式优先级最高，接下来是 `bind` 这些函数，然后是 `obj.foo()` 这种调用方式，最后是 `foo` 这种调用方式，同时，箭头函数的 `this` 一旦被绑定，就不会再被任何方式所改变

## 总结

![总结](http://blog.panxiandiao.com/20190519135243.png)

