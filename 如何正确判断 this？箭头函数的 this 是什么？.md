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

**文章最后有更新详细内容**

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

**2020-2-3号补充**

作用域共有两种主要的工作模型。第一种是最为普遍的，被大多数编程语言所采用的词法作用域，我们会对这种作用域进行深入讨论。另外一种叫作动态作用域，仍有一些编程语言在使用（比如 Bash 脚本、Perl 中的一些模式等）。

```js
function foo(a) {
 var b = a * 2;
 function bar(c) {
 console.log( a, b, c );
 }
 bar( b * 3 );
}
foo( 2 ); // 2, 4, 12
```

在这个例子中有三个逐级嵌套的作用域。为了帮助理解，可以将它们想象成几个逐级包含的气泡。

![词法作用域气泡](http://blog.panxiandiao.com//20200203141216.png)

1. 包含着整个全局作用域，其中只有一个标识符：foo。
2. 包含着 foo 所创建的作用域，其中有三个标识符：a、bar 和 b。
3. 包含着 bar 所创建的作用域，其中只有一个标识符：c

作用域气泡的结构和互相之间的位置关系给引擎提供了足够的位置信息，引擎用这些信息来查找标识符的位置。

在上一个代码片段中，引擎执行 console.log(..) 声明，并查找 a、b 和 c 三个变量的引用。它首先从最内部的作用域，也就是 bar(..) 函数的作用域气泡开始查找。引擎无法在这里找到 a，因此会去上一级到所嵌套的 foo(..) 的作用域中继续查找。在这里找到了 a，因此引擎使用了这个引用。对 b 来讲也是一样的。而对 c 来说，引擎在 bar(..) 中就找到了它。

如果 a、c 都存在于 bar(..) 和 foo(..) 的内部，console.log(..) 就可以直接使用 bar(..)中的变量，而无需到外面的 foo(..) 中查找。

作用域查找会在找到第一个匹配的标识符时停止。在多层的嵌套作用域中可以定义同名的标识符，这叫作“遮蔽效应”（内部的标识符“遮蔽”了外部的标识符）。抛开遮蔽效应，作用域查找始终从运行时所处的最内部作用域开始，逐级向外或者说向上进行，直到遇见第一个匹配的标识符为止。

全局变量会自动成为全局对象（比如浏览器中的 window 对象）的属性，因此可以不直接通过全局对象的词法名称，而是间接地通过对全局对象属性的引用来对其进行访问。**window.a**

通过这种技术可以访问那些被同名变量所遮蔽的全局变量。但非全局的变量如果被遮蔽了，无论如何都无法被访问到。

无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。

词法作用域查找只会查找一级标识符，比如 a、b 和 c。如果代码中引用了 foo.bar.baz，词法作用域查找只会试图查找 foo 标识符，找到这个变量后，对象属性访问规则会分别接管对 bar 和 baz 属性的访问。

**2020-7-24号补充**

this 是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调
用时的各种条件。this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。

当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包
含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。this 就是记录的
其中一个属性，会在函数执行的过程中用到

### 绑定规则

首先要介绍的是最常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用
其他规则时的默认规则

#### 默认绑定

首先要介绍的是最常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用
其他规则时的默认规则。

思考一下下面的代码：

```js
function foo() {
console.log( this.a );
}
var a = 2;
foo(); // 2
```

你应该注意到的第一件事是，声明在全局作用域中的变量（比如 var a = 2）就是全局对
象的一个同名属性。它们本质上就是同一个东西，并不是通过复制得到的，就像一个硬币
的两面一样。

接下来我们可以看到当调用 foo() 时，this.a 被解析成了全局变量 a。为什么？因为在本
例中，函数调用时应用了 this 的默认绑定，因此 this 指向全局对象。

那么我们怎么知道这里应用了默认绑定呢？可以通过分析调用位置来看看 foo() 是如何调
用的。在代码中，foo() 是直接使用不带任何修饰的函数引用进行调用的，因此只能使用
默认绑定，无法应用其他规则。

如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定，因此 this 会绑定
到 undefined：

```js
function foo() {
"use strict";
console.log( this.a );
}
var a = 2;
foo(); // TypeError: this is undefined
```

这里有一个微妙但是非常重要的细节，虽然 this 的绑定规则完全取决于调用位置，但是只
有 foo() 运行在非 strict mode 下时，默认绑定才能绑定到全局对象；严格模式下与 foo()
的调用位置无关：

```js
function foo() {
console.log( this.a );
}
var a = 2;
(function(){
"use strict";
foo(); // 2
})();
```

> 通常来说你不应该在代码中混合使用 strict mode 和 non-strict mode。整个
  程序要么严格要么非严格。然而，有时候你可能会用到第三方库，其严格程
  度和你的代码有所不同，因此一定要注意这类兼容性细节

#### 隐式绑定

另一条需要考虑的规则是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包
含，不过这种说法可能会造成一些误导

思考下面的代码:

```js
function foo() {
console.log( this.a );
}
var obj = {
a: 2,
foo: foo
};
obj.foo(); // 2
```

无论你如何称呼这个模式，当 foo() 被调用时，它的落脚点确实指向 obj 对象。当函数引
用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象。因为调
用 foo() 时 this 被绑定到 obj，因此 this.a 和 obj.a 是一样的

**隐式丢失**

一个最常见的 this 绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默
认绑定，从而把 this 绑定到全局对象或者 undefined 上，取决于是否是严格模式

思考下面的代码：

```js
function foo() {
console.log( this.a );
}
var obj = {
a: 2,
foo: foo
};
var bar = obj.foo; // 函数别名！
var a = "oops, global"; // a 是全局对象的属性
bar(); // "oops, global"
```

虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的
bar() 其实是一个不带任何修饰的函数调用，因此应用了默认绑定

一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时：

```js
function foo() {
console.log( this.a );
}
function doFoo(fn) {
// fn 其实引用的是 foo
fn(); // <-- 调用位置！
}
var obj = {
a: 2,
foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
doFoo( obj.foo ); // "oops, global"
```

参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值，所以结果和上一
个例子一样

如果把函数传入语言内置的函数而不是传入你自己声明的函数，会发生什么呢？结果是一
样的，没有区别：

```js
function foo() {
console.log( this.a );
}
var obj = {
a: 2,
foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
setTimeout( obj.foo, 100 ); // "oops, global"
```

JavaScript 环境中内置的 setTimeout() 函数实现和下面的伪代码类似：

```js
function setTimeout(fn,delay) {
// 等待 delay 毫秒
fn(); // <-- 调用位置！
}
```

就像我们看到的那样，回调函数丢失 this 绑定是非常常见的。除此之外，还有一种情
况 this 的行为会出乎我们意料：调用回调函数的函数可能会修改 this。

#### 显示绑定

就像我们刚才看到的那样，在分析隐式绑定时，我们必须在一个对象内部包含一个指向函
数的属性，并通过这个属性间接引用函数，从而把 this 间接（隐式）绑定到这个对象上。

那么如果我们不想在对象内部包含函数引用，而想在某个对象上强制调用函数，该怎么
做呢？

JavaScript 中的“所有”函数都有一些有用的特性（这和它们的 [\[ 原型 \]] 有关——之后我
们会详细介绍原型），可以用来解决这个问题。具体点说，可以使用函数的 call(..) 和
apply(..) 方法。严格来说，JavaScript 的宿主环境有时会提供一些非常特殊的函数，它们
并没有这两个方法。但是这样的函数非常罕见，JavaScript 提供的绝大多数函数以及你自
己创建的所有函数都可以使用 call(..) 和 apply(..) 方法

这两个方法是如何工作的呢？它们的第一个参数是一个对象，它们会把这个对象绑定到
this，接着在调用函数时指定这个 this。因为你可以直接指定 this 的绑定对象，因此我
们称之为显式绑定

思考下面的代码：

```js
function foo() {
console.log( this.a );
}
var obj = {
a:2
};
foo.call( obj ); // 2
```

通过 foo.call(..)，我们可以在调用 foo 时强制把它的 this 绑定到 obj 上。
如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作 this 的绑定对
象，这个原始值会被转换成它的对象形式（也就是 new String(..)、new Boolean(..) 或者
new Number(..)）。这通常被称为“装箱”

> 装箱操作也可以去解释为什么我们能对基本数据类型使用方法的问题

可惜，显式绑定仍然无法解决我们之前提出的丢失绑定问题

##### 硬绑定

但是显式绑定的一个变种可以解决这个问题

思考下面的代码：

```js
function foo() {
console.log( this.a );
}
var obj = {
a:2
};
var bar = function() {
foo.call( obj );
};
bar(); // 2
setTimeout( bar, 100 ); // 2
// 硬绑定的 bar 不可能再修改它的 this
bar.call( window ); // 2
```

我们来看看这个变种到底是怎样工作的。我们创建了函数 bar()，并在它的内部手动调用
了 foo.call(obj)，因此强制把 foo 的 this 绑定到了 obj。无论之后如何调用函数 bar，它
总会手动在 obj 上调用 foo。这种绑定是一种显式的强制绑定，因此我们称之为硬绑定

硬绑定的典型应用场景就是创建一个包裹函数，传入所有的参数并返回接收到的所有值：

```js
function foo(something) {
console.log( this.a, something );
return this.a + something;
}
var obj = {
a:2
};
var bar = function() {
return foo.apply( obj, arguments );
};
var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

另一种使用方法是创建一个 i 可以重复使用的辅助函数：

```js
function foo(something) {
console.log( this.a, something );
return this.a + something;
}
// 简单的辅助绑定函数
function bind(fn, obj) {
return function() {
return fn.apply( obj, arguments );
};
}
var obj = {
a:2
};
var bar = bind( foo, obj );
var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

由于硬绑定是一种非常常用的模式，所以在 ES5 中提供了内置的方法 Function.prototype.
bind，它的用法如下：

```js
function foo(something) {
console.log( this.a, something );
return this.a + something;
}
var obj = {
a:2
};
var bar = foo.bind( obj );
var b = bar( 3 ); // 2 3
console.log( b ); // 5
```
bind(..) 会返回一个硬编码的新函数，它会把参数设置为 this 的上下文并调用原始函数。

##### API调用的“上下文”

第三方库的许多函数，以及 JavaScript 语言和宿主环境中许多新的内置函数，都提供了一
个可选的参数，通常被称为“上下文”（context），其作用和 bind(..) 一样，确保你的回调
函数使用指定的 this

举例来说：

```js
function foo(el) {
console.log( el, this.id );
}
var obj = {
id: "awesome"
};
// 调用 foo(..) 时把 this 绑定到 obj
[1, 2, 3].forEach( foo, obj );
// 1 awesome 2 awesome 3 awesome
```

这些函数实际上就是通过 call(..) 或者 apply(..) 实现了显式绑定，这样你可以少些一些
代码

#### new绑定

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作

1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执行 [[ 原型 ]] 连接。
3. 这个新对象会绑定到函数调用的 this。
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

思考下面的代码：

```js
function foo(a) {
this.a = a;
}
var bar = new foo(2);
console.log( bar.a ); // 2
```

使用 new 来调用 foo(..) 时，我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this
上。new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定

> 优先级 new > 显 > 隐 > 默认

> 硬绑定会大大降低函数的灵活性，在后面文章详细介绍软绑定