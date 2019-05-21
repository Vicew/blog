---
title: let const var 区别以及使用
date: 2019-05-19 23:45:39
tags: JavaScript
categories: JavaScript
---

## 三者的区别

### 提升和暂时性死区

```js
    console.log(a) // undefined
    var a = 1
```

![挂到window上面](http://blog.panxiandiao.com/20190520164033.png)

我们可以发现，虽然变量还没有被声明，但是我们却可以使用这个未被声明的变量，这种情况就叫做提升，并且提升的是声明,变量被挂载到 `window` 上(函数也是，而且函数的提升优于变量提升)，使用 `var` 声明的变量会被提升到作用域的顶部,我们再来看`let`和`const`

```js
    var a = 1
    let b = 1
    const c = 1
    console.log(window.b) // undefined
    console.log(window. c) // undefined
    function test(){
    console.log(a)
    let a
    }
    test()
```

首先在全局作用域下使用 `let` 和 `const` 声明变量，变量并不会被挂载到 `window` 上，这一点就和 `var` 声明有了区别

`test`函数执行的时候也当然会报错,首先报错的原因是因为存在暂时性死区，我们不能在声明前就使用变量，这也是 let 和 const 优于 var 的一点

>ES6 规定暂时性死区和let、const语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为

### 连续声明

![重复声明](http://blog.panxiandiao.com/20190520172129.png)

可见变量可以重复用`var`声明

![报错](http://blog.panxiandiao.com/20190520172240.png)

`let`和`const`重复声明都会报错

### 作用域

`JS`中作用域有：全局作用域、函数作用域。没有块作用域的概念。`ES6`中新增了块级作用域。 块作用域由 `{ }`包括，`if`语句和`for`语句里面的`{ }`也属于块作用域。

- `var`定义的变量，没有块的概念，可以跨块访问, 不能跨函数访问。
- `let`定义的变量，只能在块作用域里访问，不能跨块访问，也不能跨函数访问。
- `let` 和 `const` 作用基本一致,`const`用来定义常量，使用时必须初始化(即必须赋值)，只能在块作用域里访问，而且不能修改。

举栗子

```js
    if(1 == 1)
    {
        var a = 1;
        console.log(a); // 1
    }
    console.log(a); // 1 (可见，通过var定义的变量可以跨块作用域访问到)
```

```js
    (function A() {
        var b = 2;
        console.log(b); // 2
    })();
        console.log(b); // 报错 (可见，通过var定义的变量不能跨函数作用域访问到)
```

```js
    if(1 == 1)
    {
        let a = 1;
        console.log(a); // 1 （大括号之内就是块级作用域，这里声明的a只能在块级作用域里访问）
    }
    console.log(a); // 报错
```

```js
    (function A() {
        let b = 2;
        console.log(b); // 2
    })();
        console.log(b); // 报错 (可见，通过let定义的变量也不能跨函数作用域访问到)
```

## 三者的使用

我们已经讲解了它们的主要不同，但是什么时候用 `var`、`let` 或 `const` 呢？我的建议是，大多数情况下都使用 `const`，除非你知道你的变量的值还会被改变，这样的话，别人阅读你的代码不用老想着这个变量的值会不会有改变。如果这个变量的值的确需要改变，例如在 `for` 循环里面，那么就是用 `let`。**这也同时意味着你以后就不要用 `var` 了**

关于 `const` 的使用，一些程序员还倾向于只用来声明常量，其它情况下一律使用 `let` 关键字，我觉得这样也是可行的。