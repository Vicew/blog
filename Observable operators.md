---
title: Observable operators
date: 2020-06-10 15:23:39
tags: Rxjs
categories: Rxjs
---

## 什么是 Operator？

Operators 就是一个个被附加到 Observable 型别的函数，例如像是 map, filter, contactAll... 等等，所有这些函数都会拿到原本的 observable 并回传一个新的 observable，就像有点像下面这个样子

```js
var people = Rx.Observable.of('Jerry', 'Anna');

function map(source, callback) {
    return Rx.Observable.create((observer) => {
        return source.subscribe(
            (value) => { 
                try{
                    observer.next(callback(value));
                } catch(e) {
                    observer.error(e);
                }
            },
            (err) => { observer.error(err); },
            () => { observer.complete() }
        )
    })
}

var helloPeople = map(people, (item) => item + ' Hello~');

helloPeople.subscribe(console.log);
// Jerry Hello~
// Anna Hello~
```

这里可以看到我们写了一个 map 的函数，它接收了两个参数，第一个是原本的 observable，第二个是 map 的 callback function。map 内部第一件事就是用 create 建立一个新的 observable 并回传，并且在内部订阅原本的 observable。

当然我们也可以直接把 map 塞到 Observable.prototype

```js
function map(callback) {
    return Rx.Observable.create((observer) => {
        return this.subscribe(
            (value) => { 
                try{
                    observer.next(callback(value));
                } catch(e) {
                    observer.error(e);
                }
            },
            (err) => { observer.error(err); },
            () => { observer.complete() }
        )
    })
}
Rx.Observable.prototype.map = map;
var people = Rx.Observable.of('Jerry', 'Anna');
var helloPeople = people.map((item) => item + ' Hello~');

helloPeople.subscribe(console.log);
// Jerry Hello~
// Anna Hello~
```

这里有两个重点是我们一定要知道的，每个 operator 都会回传一个新的 observable，而我们可以透过 create 的方法建立各种 operator。

> 在使用操作符的时候，用`Marble diagrams`能帮助我们更好的理解

## map

Observable 的 map 方法使用上跟数组的 map 是一样的，我们传入一个 callback function，这个 callback function 会带入每次发发送来的元素，然后我们回传新的元素，如下

```js
var source = Rx.Observable.interval(1000);
var newest = source.map(x => x + 1); 

newest.subscribe(console.log);
// 1
// 2
// 3
// 4
// 5..
```

用 Marble diagrams 表达就是

```
source: -----0-----1-----2-----3--...
            map(x => x + 1)
newest: -----1-----2-----3-----4--...
```

我们有另外一个方法跟 map 很像，叫 mapTo

## mapTo

mapTo 可以把传进来的值改成一个固定的值，如下

```js
var source = Rx.Observable.interval(1000);
var newest = source.mapTo(2); 

newest.subscribe(console.log);
// 2
// 2
// 2
// 2..
```

mapTo 用 Marble diagrams 表达

```
source: -----0-----1-----2-----3--...
                mapTo(2)
newest: -----2-----2-----2-----2--...
```

## filter

filter 在使用上也跟数组的相同，我们要传入一个 callback function，这个 function 会传入每个被发送的元素，并且回传一个 boolean 值，如果为 true 的话就会保留，如果为 false 就会被滤掉，如下

```js
var source = Rx.Observable.interval(1000);
var newest = source.filter(x => x % 2 === 0); 

newest.subscribe(console.log);
// 0
// 2
// 4
// 6..
```

filter 用 Marble diagrams 表达

```
source: -----0-----1-----2-----3-----4-...
            filter(x => x % 2 === 0)
newest: -----0-----------2-----------4-...
```

## skip

我们昨天介绍了 take 可以取前几个发送的元素，今天介绍可以略过前几个发送元素的 operator: skip，示例如下：

```js
var source = Rx.Observable.interval(1000);
var example = source.skip(3);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 3
// 4
// 5...
```

原本从 0 开始的就会变成从 3 开始，但是记得原本元素的等待时间仍然存在，也就是说此示例第一个取得的元素需要等 4 秒，用 Marble Diagram 表示如下。

```
source : ----0----1----2----3----4----5--....
                    skip(3)
example: -------------------3----4----5--...
```

## takeLast

除了可以用 take 取前几个之外，我们也可以倒过来取最后几个，示例如下：

```js
var source = Rx.Observable.interval(1000).take(6);
var example = source.takeLast(2);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 4
// 5
// complete
```

这里我们先取了前 6 个元素，再取最后两个。所以最后会发送 4, 5, complete，这里有一个重点，就是 takeLast 必须等到整个 observable 完成(complete)，才能知道最后的元素有哪些，并且`同步发送`，如果用 Marble Diagram 表示如下

```
source : ----0----1----2----3----4----5|
                takeLast(2)
example: ------------------------------(45)|
```

这里可以看到 takeLast 后，比须等到原本的 observable 完成后，才立即同步发送 4, 5, complete。

## last

跟 take(1) 相同，我们有一个 takeLast(1) 的简化写法，那就是 last() 用来取得最后一个元素。

```js
var source = Rx.Observable.interval(1000).take(6);
var example = source.last();

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 5
// complete
```

用 Marble Diagram 表示如下

```
source : ----0----1----2----3----4----5|
                    last()
example: ------------------------------(5)|
```

## concat

concat 可以把多个 observable 实例合并成一个，示例如下

```js
var source = Rx.Observable.interval(1000).take(3);
var source2 = Rx.Observable.of(3)
var source3 = Rx.Observable.of(4,5,6)
var example = source.concat(source2, source3);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 1
// 2
// 3
// 4
// 5
// 6
// complete
```

跟 concatAll 一样，必须先等前一个 observable 完成(complete)，才会继续下一个，用 Marble Diagram 表示如下。

```
source : ----0----1----2|
source2: (3)|
source3: (456)|
            concat()
example: ----0----1----2(3456)|
```

另外 concat 还可以当作静态方法使用

```js
var source = Rx.Observable.interval(1000).take(3);
var source2 = Rx.Observable.of(3);
var source3 = Rx.Observable.of(4,5,6);
var example = Rx.Observable.concat(source, source2, source3);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

## startWith

startWith 可以在 observable 的一开始塞要发送的元素，有点像 concat 但参数不是 observable 而是要发送的元素，使用示例如下

```js
var source = Rx.Observable.interval(1000);
var example = source.startWith(0);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 0
// 1
// 2
// 3...
```

这里可以看到我们在 source 的一开始塞了一个 0，让 example 会在一开始就立即发送 0，用 Marble Diagram 表示如下

```
source : ----0----1----2----3--...
                startWith(0)
example: (0)----0----1----2----3--...
```

记得 startWith 的值是一开始就`同步发出`的，这个 operator 很常被用来保存程序的起始状态！

## merge

merge 跟 concat 一样都是用来合并 observable，但他们在行为上有非常大的不同！

让我们直接来看例子吧

```js
var source = Rx.Observable.interval(500).take(3);
var source2 = Rx.Observable.interval(300).take(6);
var example = source.merge(source2);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 0
// 1
// 2
// 1
// 3
// 2
// 4
// 5
// complete
```

上面可以看得出来，merge 把多个 observable 同时处理，这跟 concat 一次处理一个 observable 是完全不一样的，由于是同时处理行为会变得较为复杂，这里我们用 Marble Diagram 会比较好解释。

```
source : ----0----1----2|
source2: --0--1--2--3--4--5|
            merge()
example: --0-01--21-3--(24)--5|
```

这里可以看到 merge 之后的 example 在时间序上同时在跑 source 与 source2，当两件事情同时发生时，会同步发送资料(被 merge 的在后面)，当两个 observable 都结束时才会真的结束。

merge 同样可以当作静态方法用

```js
var source = Rx.Observable.interval(500).take(3);
var source2 = Rx.Observable.interval(300).take(6);
var example = Rx.Observable.merge(source, source2);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

merge 的逻辑有点像是 OR(||)，就是当两个 observable 其中一个被触发时都可以被处理，这很常用在一个以上的按钮具有部分相同的行为。

例如一个影片播放器有两个按钮，一个是暂停(II)，另一个是结束播放(口)。这两个按钮都具有相同的行为就是影片会被停止，只是结束播放会让影片回到 00 秒，这时我们就可以把这两个按钮的事件 merge 起来处理影片暂停这件事。

```js
var stopVideo = Rx.Observable.merge(stopButton, endButton);

stopVideo.subscribe(() => {
    // 暂停播放影片
})
```

## combineLatest

首先我们要介绍的是 combineLatest，它会取得各个 observable 最后送出的值，再输出成一个值，我们直接看示例会比较好解释。

```js
var source = Rx.Observable.interval(500).take(3);
var newest = Rx.Observable.interval(300).take(6);

var example = source.combineLatest(newest, (x, y) => x + y);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// complete
```

大家第一次看到这个 output 应该都会很困惑，我们直接来看 Marble Diagram 吧！

```
source : ----0----1----2|
newest : --0--1--2--3--4--5|

    combineLatest(newest, (x, y) => x + y);

example: ----01--23-4--(56)--7|
```

首先 combineLatest 可以接收多个 observable，最后一个参数是 callback function，这个 callback function 接收的参数数量跟合并的 observable 数量相同，依照示例来说，因为我们这里合并了两个 observable 所以后面的 callback function 就接收 x, y 两个参数，x 会接收从 source 发送出来的值，y 会接收从 newest 发送出来的值。

最后一个重点就是一定会等两个 observable 都曾有送值出来才会呼叫我们传入的 callback，所以这段程式是这样运行的

- newest 送出了 0，但此时 source 并没有送出过任何值，所以不会执行 callback
- source 送出了 0，此时 newest 最后一次送出的值为 0，把这两个数传入 callback 得到 0。
- newest 送出了 1，此时 source 最后一次送出的值为 0，把这两个数传入 callback 得到 1。
- newest 送出了 2，此时 source 最后一次送出的值为 0，把这两个数传入 callback 得到 2。
- source 送出了 1，此时 newest 最后一次送出的值为 2，把这两个数传入 callback 得到 3。
- newest 送出了 3，此时 source 最后一次送出的值为 1，把这两个数传入 callback 得到 4。
- source 送出了 2，此时 newest 最后一次送出的值为 3，把这两个数传入 callback 得到 5。
- source 结束，但 newest 还没结束，所以 example 还不会结束。
- newest 送出了 4，此时 source 最后一次送出的值为 2，把这两个数传入 callback 得到 6。
- newest 送出了 5，此时 source 最后一次送出的值为 2，把这两个数传入 callback 得到 7。
- newest 结束，因为 source 也结束了，所以 example 结束。

不管是 source 还是 newest 送出值来，只要另一方曾有送出过值(有最后的值)，就会执行 callback 并送出新的值，这就是 combineLatest。

combineLatest 很常用在运算多个因子的结果，例如最常见的 BMI 计算，我们身高变动时就拿上一次的体重计算新的 BMI，当体重变动时则拿上一次的身高计算 BMI，这就很适合用 combineLatest 来处理！

## zip

在讲 withLatestFrom 之前，先让我们先来看一下 zip 是怎么运行的，zip 会取每个 observable 相同顺位的元素并传入 callback，也就是说每个 observable 的第 n 个元素会一起被传入 callback，这里我们同样直接用示例讲解会比较清楚

```js
var source = Rx.Observable.interval(500).take(3);
var newest = Rx.Observable.interval(300).take(6);

var example = source.zip(newest, (x, y) => x + y);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 2
// 4
// complete
```

Marble Diagram 长这样

```
source : ----0----1----2|
newest : --0--1--2--3--4--5|
    zip(newest, (x, y) => x + y)
example: ----0----2----4|
```

以我们的示例来说，zip 会等到 source 跟 newest 都送出了第一个元素，再传入 callback，下次则等到 source 跟 newest 都送出了第二个元素再一起传入 callback，所以运行的步骤如下：

- newest 送出了第一个值 0，但此时 source 并没有送出第一个值，所以不会执行 callback。
- source 送出了第一个值 0，newest 之前送出的第一个值为 0，把这两个数传入 callback 得到 0。
- newest 送出了第二个值 1，但此时 source 并没有送出第二个值，所以不会执行 callback。
- newest 送出了第三个值 2，但此时 source 并没有送出第三个值，所以不会执行 callback。
- source 送出了第二个值 1，newest 之前送出的第二个值为 1，把这两个数传入 callback 得到 2。
- newest 送出了第四个值 3，但此时 source 并没有送出第四个值，所以不会执行 callback。
- source 送出了第三个值 2，newest 之前送出的第三个值为 2，把这两个数传入 callback 得到 4。
- source 结束 example 就直接结束，因为 source 跟 newest 不会再有对应顺位的值

zip 会把各个 observable 相同顺位送出的值传入 callback，这很常拿来做 demo 使用，比如我们想要间隔 100ms 送出 'h', 'e', 'l', 'l', 'o'，就可以这么做

```js
var source = Rx.Observable.from('hello');
var source2 = Rx.Observable.interval(100);

var example = source.zip(source2, (x, y) => x);
```

这里的 Marble Diagram 就很简单

```
source : (hello)|
source2: -0-1-2-3-4-...
        zip(source2, (x, y) => x)
example: -h-e-l-l-o|
```

这里我们利用 zip 来达到原本只能同步送出的资料变成了非同步的，很适合用在建立示范用的资料。

> 建议大家平常没事不要乱用 zip，除非真的需要。因为 zip 必须 cache 住还没处理的元素，当我们两个 observable 一个很快一个很慢时，就会 cache 非常多的元素，等待比较慢的那个 observable。这很有可能造成内存相关的问题！

## withLatestFrom

withLatestFrom 运行方式跟 combineLatest 有点像，只是他有主从的关系，只有在主要的 observable 送出新的值时，才会执行 callback，附随的 observable 只是在背景下运行。让我们看一个例子

```js
var main = Rx.Observable.from('hello').zip(Rx.Observable.interval(500), (x, y) => x);
var some = Rx.Observable.from([0,1,0,0,0,1]).zip(Rx.Observable.interval(300), (x, y) => x);

var example = main.withLatestFrom(some, (x, y) => {
    return y === 1 ? x.toUpperCase() : x;
});

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

先看一下 Marble Diagram

```
main   : ----h----e----l----l----o|
some   : --0--1--0--0--0--1|

withLatestFrom(some, (x, y) =>  y === 1 ? x.toUpperCase() : x);

example: ----h----e----l----L----O|
```

withLatestFrom 会在 main 送出值的时候执行 callback，但请注意如果 main 送出值时 some 之前没有送出过任何值 callback 仍然不会执行！

这里我们在 main 送出值时，去判断 some 最后一次送的值是不是 1 来决定是否要切换大小写，执行步骤如下

- main 送出了 h，此时 some 上一次送出的值为 0，把这两个参数传入 callback 得到 h。
- main 送出了 e，此时 some 上一次送出的值为 0，把这两个参数传入 callback 得到 e。
- main 送出了 l，此时 some 上一次送出的值为 0，把这两个参数传入 callback 得到 l。
- main 送出了 l，此时 some 上一次送出的值为 1，把这两个参数传入 callback 得到 L。
- main 送出了 o，此时 some 上一次送出的值为 1，把这两个参数传入 callback 得到 O。

withLatestFrom 很常用在一些 checkbox 型的功能，例如说一个编辑器，我们开启粗体后，打出来的字就都要变粗体，粗体就像是 some observable，而我们打字就是 main observable。

## scan

scan 其实就是 Observable 版本的 reduce 只是命名不同。如果熟悉数组操作的话，应该会知道原生的 JS Array 就有 reduce 的方法，使用方式如下

```js
var arr = [1, 2, 3, 4];
var result = arr.reduce((origin, next) => { 
    console.log(origin)
    return origin + next
}, 0);

console.log(result)
// 0
// 1
// 3
// 6
// 10
```

reduce 方法需要传两个参数，第一个是 callback 第二个则是起始状态，这个 callback 执行时，会传入两个参数一个是原本的状态，第二个是修改原本状态的参数，最后回传一个新的状态，再继续执行。

所以这段代码是这样执行的

- 第一次执行 callback 起始状态是 0 所以 origin 传入 0，next 为 arr 的第一个元素 1，相加之后变成 1 回传并当作下一次的状态。
- 第二次执行 callback，这时原本的状态(origin)就变成了 1，next 为 arr 的第二个元素 2，相加之后变成 3 回传并当作下一次的状态。
- 第三次执行 callback，这时原本的状态(origin)就变成了 3，next 为 arr 的第三个元素 3，相加之后变成 6 回传并当作下一次的状态。
- 第四次执行 callback，这时原本的状态(origin)就变成了 6，next 为 arr 的第四个元素 4，相加之后变成 10 回传并当作下一次的状态。
- 这时 arr 的元素都已经遍历过了，所以不会直接把 10 回传。

scan 整体的运行方式都跟 reduce 一样，示例如下

```js
var source = Rx.Observable.from('hello')
             .zip(Rx.Observable.interval(600), (x, y) => x);

var example = source.scan((origin, next) => origin + next, '');

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// h
// he
// hel
// hell
// hello
// complete
```

画成 Marble Diagram

```
source : ----h----e----l----l----o|
    scan((origin, next) => origin + next, '')
example: ----h----(he)----(hel)----(hell)----(hello)|
```

这里可以看到第一次传入 'h' 跟 '' 相加，返回 'h' 当作下一次的初始状态，一直重复下去。

> scan 跟 reduce 最大的差别就在 scan 一定会回传一个 observable 实例，而 reduce 最后回传的值有可能是任何资料型别，必须看使用者传入的 callback 才能决定 reduce 最后的返回值。

scan 很常用在状态的计算处理，最简单的就是对一个数字的加减，我们可以绑定一个 button 的 click 事件，并用 map 把 click event 转成 1，之后送处 scan 计算值再做显示。

```js
const addButton = document.getElementById('addButton');
const minusButton = document.getElementById('minusButton');
const state = document.getElementById('state');

const addClick = Rx.Observable.fromEvent(addButton, 'click').mapTo(1);
const minusClick = Rx.Observable.fromEvent(minusButton, 'click').mapTo(-1);

const numberState = Rx.Observable.empty()
  .startWith(0)
  .merge(addClick, minusClick)
  .scan((origin, next) => origin + next, 0)

numberState
  .subscribe({
    next: (value) => { state.innerHTML = value;},
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
  });
```

这里我们用了两个 button，一个是 add 按钮，一个是 minus 按钮。

我把这两个按钮的点击事件各建立了 addClcik, minusClick 两个 observable，这两个 observable 直接 mapTo(1) 跟 mapTo(-1)，代表被点击后会各自送出的数字！

接着我们用了 empty() 建立一个空的 observable 代表画面上数字的状态，搭配 startWith(0) 来设定初始值，接着用 merge 把两个 observable 合并透过 scan 处理之后的逻辑，最后在 subscribe 来更改画面的显示。

## buffer

buffer 是一整个家族，总共有五个相关的 operators

- buffer
- bufferCount
- bufferTime
- bufferToggle
- bufferWhen

这里比较常用到的是 buffer, bufferCount 跟 bufferTime 这三个，我们直接来看示例。

```js
var source = Rx.Observable.interval(300);
var source2 = Rx.Observable.interval(1000);
var example = source.buffer(source2);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// [0,1,2]
// [3,4,5]
// [6,7,8]...
```

画成 Marble Diagram 则像是

```
source : --0--1--2--3--4--5--6--7..
source2: ---------0---------1--------...
            buffer(source2)
example: ---------([0,1,2])---------([3,4,5])    
```

buffer 要传入一个 observable(source2)，它会把原本的 observable (source)送出的元素缓存在数组中，等到传入的 observable(source2) 送出元素时，就会触发把缓存的元素送出。

这里的示例 source2 是每一秒就会送出一个元素，我们可以改用 bufferTime 简洁的表达，如下

```js
var source = Rx.Observable.interval(300);
var example = source.bufferTime(1000);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// [0,1,2]
// [3,4,5]
// [6,7,8]...
```

除了用时间来作缓存外，我们更常用数量来做缓存，示例如下

```js
var source = Rx.Observable.interval(300);
var example = source.bufferCount(3);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// [0,1,2]
// [3,4,5]
// [6,7,8]...
```

我们可以用 buffer 来做某个事件的过滤，例如像是滑鼠连点才能真的执行，这里我们一样写了一个小示例

```js
const button = document.getElementById('demo');
const click = Rx.Observable.fromEvent(button, 'click')
const example = click
                .bufferTime(500)
                .filter(arr => arr.length >= 2);

example.subscribe({
    next: (value) => { console.log('success'); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

这里我们只有在 500 毫秒内连点两下，才能成功印出 'success'，这个功能在某些特殊的需求中非常的好用，也能用在批次处理来降低 request 传送的次数！

## delay

delay 可以延迟 observable `一开始`发送元素的时间点，示例如下

```js
var source = Rx.Observable.interval(300).take(5);

var example = source.delay(500);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 1
// 2
// 3
// 4
```

当然直接从 log 出的讯息看，是完全看不出差异的

让我们直接看 Marble Diagram

```
source : --0--1--2--3--4|
        delay(500)
example: -------0--1--2--3--4|
```

从 Marble Diagram 可以看得出来，第一次送出元素的时间变慢了，虽然在这里看起来没什么用，但是在 UI 操作上是非常有用的，这个部分我们最后示范。

delay 除了可以传入毫秒以外，也可以传入 Date 型别的资料，如下使用方式

```js
var source = Rx.Observable.interval(300).take(5);

var example = source.delay(new Date(new Date().getTime() + 1000));

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

## delayWhen

delayWhen 的作用跟 delay 很像，最大的差别是 delayWhen 可以影响每个元素，而且需要传一个 callback 并回传一个 observable，示例如下

```js
var source = Rx.Observable.interval(300).take(5);

var example = source
              .delayWhen(
                  x => Rx.Observable.empty().delay(100 * x * x)
              );

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

这时我们的 Marble Diagram 如下

```
source : --0--1--2--3--4|
    .delayWhen(x => Rx.Observable.empty().delay(100 * x * x));
example: --0---1----2-----3-----4|
```

这里传进来的 x 就是 source 送出的每个元素，这样我们就能对每一个做延迟。

这里我们用 delay 来做一个小功能，这个功能很简单就是让多张照片跟着滑鼠跑，但每张照片不能跑一样快！

首先我们准备六张大头照，并且写进 HTML

```html
<img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover6.jpg" alt="">
<img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover5.jpg" alt="">
<img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover4.jpg" alt="">
<img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover3.jpg" alt="">
<img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover2.jpg" alt="">
<img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover1.jpg" alt="">
```

用 CSS 把 img 改成圆形，并加上边筐以及绝对位置

```css
img{
  position: absolute;
  border-radius: 50%;
  border: 3px white solid;
  transform: translate3d(0,0,0);
}
```

再来写 JS，一样第一步先抓 DOM

```js
var imgList = document.getElementsByTagName('img');
```

第二步建立 observable

```js
var movePos = Rx.Observable.fromEvent(document, 'mousemove')
.map(e => ({ x: e.clientX, y: e.clientY }))
```

第三步撰写逻辑

```js
function followMouse(DOMArr) {
  const delayTime = 600;
  DOMArr.forEach((item, index) => {
    movePos
      .delay(delayTime * (Math.pow(0.65, index) + Math.cos(index / 4)) / 2)
      .subscribe(function (pos){
        item.style.transform = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px, 0)';
      });
  });
}

followMouse(Array.from(imgList))
```

这里我们把 imgList 从 Collection 转成 Array 后传入 followMouse()，并用 forEach 把每个 omg 取出并利用 index 来达到不同的 delay 时间，这个 delay 时间的逻辑大家可以自己想，不用跟我一样，最后 subscribe 就完成啦！

## debounce

跟 buffer、bufferTime 一样，Rx 有 debounce 跟 debounceTime 一个是传入 observable 另一个则是传入毫秒，比较常用到的是 debounceTime，这里我们直接来看一个示例

```js
var source = Rx.Observable.interval(300).take(5);
var example = source.debounceTime(1000);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 4
// complete
```

这里只印出 4 然后就结束了，因为 debounce 运行的方式是每次收到元素，他会先把元素 cache 住并等待一段时间，如果这段时间内已经没有收到任何元素，则把元素送出；如果这段时间内又收到新的元素，则会把原本 cache 住的元素释放掉并重新计时，不断反复。

以现在这个示例来讲，我们每 300 毫秒就会送出一个数值，但我们的 debounceTime 是 1000 毫秒，也就是说每次 debounce 收到元素还等不到 1000 毫秒，就会收到下一个新元素，然后重新等待 1000 毫秒，如此重复直到第五个元素送出时，observable 结束(complete)了，debounce 就直接送出元素。

以 Marble Diagram 表示如下

```
source : --0--1--2--3--4|
        debounceTime(1000)
example: --------------4|
```

debounce 会在收到元素后等待一段时间，这很适合用来处理间歇行为，间歇行为就是指这个行为是一段一段的，例如要做 Auto Complete 时，我们要打字搜寻不会一直不断的打字，可以等我们停了一小段时间后再送出，才不会每打一个字就送一次 request！

这里举一个简单的例子，假设我们想要自动传送使用者打的字到后端

```js
const searchInput = document.getElementById('searchInput');
const theRequestValue = document.getElementById('theRequestValue');

Rx.Observable.fromEvent(searchInput, 'input')
  .debounceTime(300)
  .map(e => e.target.value)
  .subscribe((value) => {
    theRequestValue.textContent = value;
    // 在这里发 request
  })
```

## throttle

基本上每次看到 debounce 就会看到 throttle，他们两个的作用都是要降低事件的触发频率，但行为上有很大的不同。

跟 debounce 一样 RxJS 有 throttle 跟 throttleTime 两个方法，一个是传入 observable 另一个是传入毫秒，比较常用到的也是 throttleTime，让我们直接来看示例

```js
var source = Rx.Observable.interval(300).take(5);
var example = source.throttleTime(1000);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 4
// complete
```

JS的详细防抖节流请移步我的另一篇博客 [深入防抖节流](http://www.panxiandiao.com/2019/12/10/%E6%B7%B1%E5%85%A5%E9%98%B2%E6%8A%96%E8%8A%82%E6%B5%81/#more)

## distinct

如果会下 SQL 指令的应该都对 distinct 不陌生，它能帮我们把相同值的资料滤掉只留一笔，RxJS 里的 distinct 也是相同的作用，让我们直接来看示例

```js
var source = Rx.Observable.from(['a', 'b', 'c', 'a', 'b'])
            .zip(Rx.Observable.interval(300), (x, y) => x);
var example = source.distinct()

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// a
// b
// c
// complete
```

如果用 Marble Diagram 表示如下

```
source : --a--b--c--a--b|
            distinct()
example: --a--b--c------|
```

从上面的示例可以看得出来，当我们用 distinct 后，只要有重复出现的值就会被过滤掉。

另外我们可以传入一个 selector callback function，这个 callback function 会传入一个接收到的元素，并回传我们真正希望比对的值，举例如下

```js
var source = Rx.Observable.from([{ value: 'a'}, { value: 'b' }, { value: 'c' }, { value: 'a' }, { value: 'c' }])
            .zip(Rx.Observable.interval(300), (x, y) => x);
var example = source.distinct((x) => {
    return x.value
});

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// {value: "a"}
// {value: "b"}
// {value: "c"}
// complete
```

这里可以看到，因为 source 送出的都是实例，而 js 事件的比对是比对内存位置，所以在这个例子中这些实例永远不会相等，但实际上我们想比对的是实例中的 value，这时我们就可以传入 selector callback，来选择我们要比对的值。

实际上 distinct() 会在背地里建立一个 Set，当接收到元素时会先去判断 Set 内是否有相同的值，如果有就不送出，如果没有则存到 Set 并送出。所以记得尽量不要直接把 distinct 用在一个无限的 observable 里，这样很可能会让 Set 越来越大，建议大家可以放第二个参数 flushes，或用 distinctUntilChanged

> 这里指的 Set 其实是 RxJS 自己实现的，跟 ES6 原生的 Set 行为也都一致，只是因为 ES6 的 Set 支持程度还并不理想，所以这里是直接用 JS 实现。

distinct 可以传入第二个参数 flushes observable 用来清除暂存的资料，示例如下

```js
var source = Rx.Observable.from(['a', 'b', 'c', 'a', 'c'])
            .zip(Rx.Observable.interval(300), (x, y) => x);
var flushes = Rx.Observable.interval(1300);
var example = source.distinct(null, flushes);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// a
// b
// c
// c
// complete
```

这里我们用 Marble Diagram 比较好表示

```
source : --a--b--c--a--c|
flushes: ------------0---...
        distinct(null, flushes);
example: --a--b--c-----c|
```

其实 flushes observable 就是在送出元素时，会把 distinct 的暂存清空，所以之后的暂存就会从头来过，这样就不用担心暂存的 Set 越来愈大的问题，但其实我们平常不太会用这样的方式来处理，通常会用另一个方法 distinctUntilChanged。

## distinctUntilChanged

distinctUntilChanged 跟 distinct 一样会把相同的元素过滤掉，但 distinctUntilChanged 只会跟最后一次送出的元素比较，不会每个都比，举例如下

```js
var source = Rx.Observable.from(['a', 'b', 'c', 'c', 'b'])
            .zip(Rx.Observable.interval(300), (x, y) => x);
var example = source.distinctUntilChanged()

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// a
// b
// c
// b
// complete
```

这里 distinctUntilChanged 只会暂存一个元素，并在收到元素时跟暂存的元素比对，如果一样就不送出，如果不一样就把暂存的元素换成刚接收到的新元素并送出。

```
source : --a--b--c--c--b|
            distinctUntilChanged()
example: --a--b--c-----b|
```

从 Marble Diagram 中可以看到，第二个 c 送出时刚好上一个就是 c 所以就被滤掉了，但最后一个 b 则跟上一个不同所以没被滤掉。

distinctUntilChanged 是比较常在开发中上使用的，最常见的状况是我们在做多方同步时。当我们有多个 Client，且每个 Client 有着各自的状态，Server 会再一个 Client 需要变动时通知所有 Client 更新，但可能某些 Client 接收到新的状态其实跟上一次收到的是相同的，这时我们就可用 distinctUntilChanged 方法只处理跟最后一次不相同的讯息，像是多方通话、多装置的资讯同步都会有类似的情境。

## catch

catch 是很常见的非同步错误处理方法，在 RxJS 中也能够直接用 catch 来处理错误，在 RxJS 中的 catch 可以回传一个 observable 来送出新的值，让我们直接来看示例：

```js
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .catch(error => Rx.Observable.of('h'));

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});   
```

这个示例我们每隔 500 毫秒会送出一个字串(String)，并用字串的方法 toUpperCase() 来把字串的英文字母改成大写，过程中可能未知的原因送出了一个数值(Number) 2 导致发生例外(数值没有 toUpperCase 的方法)，这时我们在后面接的 catch 就能抓到错误。

catch 可以回传一个新的 Observable、Promise、Array 或任何 Iterable 的事件，来传送之后的元素。

以我们的例子来说最后就会在送出 X 就结束，画成 Marble Diagram 如下

```
source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
         ----a----b----c----d----X|
        catch(error => Rx.Observable.of('h'))
example: ----a----b----c----d----h|       
```

这里可以看到，当错误发生后就会进到 catch 并重新处理一个新的 observable，我们可以利用这个新的 observable 来送出我们想送的值。

也可以在遇到错误后，让 observable 结束，如下

```js
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .catch(error => Rx.Observable.empty());

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});     
```

回传一个 empty 的 observable 来直接结束(complete)。

另外 catch 的 callback 能接收第二个参数，这个参数会接收当前的 observalbe，我们可以回传当前的 observable 来做到重新执行，示例如下

```js
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .catch((error, obs) => obs);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});        
```

这里可以看到我们直接回传了当前的 obserable(其实就是 example)来重新执行，画成 Marble Diagram 如下

```
source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
         ----a----b----c----d----X|
        catch((error, obs) => obs)
example: ----a----b----c----d--------a----b----c----d--..
```

因为是我们只是简单的示范，所以这里会一直无限循环，实务上通常会用在断线重连的情境。

另上面的处理方式有一个简化的写法，叫做 retry()。

## retry

如果我们想要一个 observable 发生错误时，重新尝试就可以用 retry 这个方法，跟我们前一个讲示例的行为是一致

```js
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .retry();

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
}); 
```

通常这种无限的 retry 会放在即时同步的重新连接，让我们在连线断掉后，不断的尝试。另外我们也可以设定只尝试几次，如下

```js
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .retry(1);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
}); 
// a
// b
// c
// d
// a
// b
// c
// d
// Error: TypeError: x.toUpperCase is not a function
```

这里我们对 retry 传入一个数值 1，能够让我们只重复尝试 1 次后送出错误，画成 Marble Diagram 如下

```
source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
         ----a----b----c----d----X|
                retry(1)
example: ----a----b----c----d--------a----b----c----d----X|
```

这种处理方式很适合用在 HTTP request 失败的场景中，我们可以设定重新发送几次后，再秀出错误讯息。

## retryWhen

RxJS 还提供了另一种方法 retryWhen，他可以把例外发生的元素放到一个 observable 中，让我们可以直接操作这个 observable，并等到这个 observable 操作完后再重新订阅一次原本的 observable。

这里我们直接来看代码

```js
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .retryWhen(errorObs => errorObs.delay(1000));

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
}); 
```

这里 retryWhen 我们传入一个 callback，这个 callback 有一个参数会传入一个 observable，这个 observable 不是原本的 observable(example) 而是例外事件送出的错误所组成的一个 observable，我们可以对这个由错误所组成的 observable 做操作，等到这次的处理完成后就会重新订阅我们原本的 observable。

这个示例我们是把错误的 observable 送出错误延迟 1 秒，这会使后面重新订阅的动作延迟 1 秒才执行，画成 Marble Diagram 如下

```
source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
         ----a----b----c----d----X|
        retryWhen(errorObs => errorObs.delay(1000))
example: ----a----b----c----d-------------------a----b----c----d----...
```

从上图可以看到后续重新订阅的行为就被延后了，但实务上我们不太会用 retryWhen 来做重新订阅的延迟，通常是直接用 catch 做到这件事。这里只是为了示范 retryWhen 的行为，实务上我们通常会把 retryWhen 拿来做错误通知或是例外收集，如下

```js
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .retryWhen(
                errorObs => errorObs.map(err => fetch('...')));

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
}); 
```

这里的 errorObs.map(err => fetch('...')) 可以把 errorObs 里的每个错误变成 API 的发送，通常这里个 API 会像是送讯息到公司的通讯频道(Slack 等等)，这样可以让工程师马上知道可能哪个 API 挂了，这样我们就能即时地处理。

> retryWhen 实际上是在背地里建立一个 Subject 并把错误放入，会在对这个 Subject 进行内部的订阅，因为我们还没有讲到 Subject 的观念，大家可以先把它当作 Observable 就好了，另外记得这个 observalbe 预设是无限的，如果我们把它结束，原本的 observable 也会跟着结束。

## repeat

我们有时候可能会想要 retry 一直重复订阅的效果，但没有错误发生，这时就可以用 repeat 来做到这件事，示例如下

```js
var source = Rx.Observable.from(['a','b','c'])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source.repeat(1);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

// a
// b
// c
// a
// b
// c
// complete
```

这里 repeat 的行为跟 retry 基本一致，只是 retry 只有在例外发生时才触发，画成 Marble Diagram 如下

```
source : ----a----b----c|
            repeat(1)
example: ----a----b----c----a----b----c|
```

同样的我们可以不给参数让他无限循环，如下

```js
var source = Rx.Observable.from(['a','b','c'])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source.repeat();

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

这样我们就可以做动不断重复的行为，这个可以在建立轮询时使用，让我们不断地发 request 来更新画面。

最后我们来看一个错误处理在实际应用中的小示例

```js
const title = document.getElementById('title');

var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x)
            .map(x => x.toUpperCase()); 
            // 通常 source 会是建立即时同步的连线，像是 web socket

var example = source.catch(
                (error, obs) => Rx.Observable.empty()
                               .startWith('连线发生错误： 5秒后重连')
                               .concat(obs.delay(5000))
                 );

example.subscribe({
    next: (value) => { title.innerText = value },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
}); 
```

这个示例其实就是模仿在即时同步断线时，利用 catch 返回一个新的 observable，这个 observable 会先送出错误讯息并且把原本的 observable 延迟 5 秒再做合并，虽然这只是一个模仿，但它清楚的展示了 RxJS 在做错误处理时的灵活性。

## concatAll

我们在讲简易拖拽的示例时就有讲过这个 operator，concatAll 最重要的重点就是他会处理完前一个 observable 才会在处理下一个 observable，让我们来看一个示例

```js
var click = Rx.Observable.fromEvent(document.body, 'click');
var source = click.map(e => Rx.Observable.interval(1000));

var example = source.concatAll();
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// (点击后)
// 0
// 1
// 2
// 3
// 4
// 5 ...
```

上面这段代码，当我们点击画面时就会开始送出数值，如果用 Marble Diagram 表示如下

```
click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
source : ---------o-o------------------o--..
                   \ \
                    \ ----0----1----2----3----4--...
                     ----0----1----2----3----4--...
                     concatAll()
example: ----------------0----1----2----3----4--..
```

从 Marble Diagram 可以看得出来，当我们点击一下 click 事件会被转成一个 observable 而这个 observable 会每一秒送出一个递增的数值，当我们用 concatAll 之后会把二维的 observable 摊平成一维的 observable，但 concatAll 会一个一个处理，一定是等前一个 observable 完成(complete)才会处理下一个 observable，因为现在送出 observable 是无限的永远不会完成(complete)，就导致他永远不会处理第二个送出的 observable!

我们再看一个例子

```js
var click = Rx.Observable.fromEvent(document.body, 'click');
var source = click.map(e => Rx.Observable.interval(1000).take(3));

var example = source.concatAll();
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

现在我们把送出的 observable 限制只取前三个元素，用 Marble Diagram 表示如下

```
click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
source : ---------o-o------------------o--..
                   \ \                  \
                    \ ----0----1----2|   ----0----1----2|
                     ----0----1----2|
                     concatAll()
example: ----------------0----1----2----0----1----2--..
```

这里我们把送出的 observable 变成有限的，只会送出三个元素，这时就能看得出来 concatAll 不管两个 observable 送出的时间多么相近，一定会先处理前一个 observable 再处理下一个。

## switch

switch 同样能把二维的 observable 摊平成一维的，但他们在行为上有很大的不同，我们来看下面这个示例

```js
var click = Rx.Observable.fromEvent(document.body, 'click');
var source = click.map(e => Rx.Observable.interval(1000));

var example = source.switch();
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

用 Marble Diagram 表示如下

```
click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
source : ---------o-o------------------o--..
                   \ \                  \----0----1--...
                    \ ----0----1----2----3----4--...
                     ----0----1----2----3----4--...
                     switch()
example: -----------------0----1----2--------0----1--...
```

switch 最重要的就是他会在新的 observable 送出后直接处理新的 observable 不管前一个 observable 是否完成，每当有新的 observable 送出就会直接把旧的 observable 退订(unsubscribe)，永远只处理最新的 observable!

所以在这上面的 Marble Diagram 可以看得出来第一次送出的 observable 跟第二次送出的 observable 时间点太相近，导致第一个 observable 还来不及送出元素就直接被退订了，当下一次送出 observable 就又会把前一次的 observable 退订。

## mergeAll

我们之前讲过 merge 他可以让多个 observable 同时送出元素，mergeAll 也是同样的道理，它会把二维的 observable 转成一维的，并且能够同时处理所有的 observable，让我们来看这个示例

```js
var click = Rx.Observable.fromEvent(document.body, 'click');
var source = click.map(e => Rx.Observable.interval(1000));

var example = source.mergeAll();
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

上面这段代码用 Marble Diagram 表示如下

```
click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
source : ---------o-o------------------o--..
                   \ \                  \----0----1--...
                    \ ----0----1----2----3----4--...
                     ----0----1----2----3----4--...
                     switch()
example: ----------------00---11---22---33---(04)4--...
```

从 Marble Diagram 可以看出来，所有的 observable 是并行(Parallel)处理的，也就是说 mergeAll 不会像 switch 一样退订(unsubscribe)原先的 observable 而是并行处理多个 observable。以我们的示例来说，当我们点击越多下，最后送出的频率就会越快。

另外 mergeAll 可以传入一个数值，这个数值代表他可以同时处理的 observable 数量，我们来看一个例子

```js
var click = Rx.Observable.fromEvent(document.body, 'click');
var source = click.map(e => Rx.Observable.interval(1000).take(3));

var example = source.mergeAll(2);
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

这里我们送出的 observable 改成取前三个，并且让 mergeAll 最多只能同时处理 2 个 observable，用 Marble Diagram 表示如下

```
click  : ---------c-c----------o----------.. 
        map(e => Rx.Observable.interval(1000))
source : ---------o-o----------c----------..
                   \ \          \----0----1----2|     
                    \ ----0----1----2|  
                     ----0----1----2|
                     mergeAll(2)
example: ----------------00---11---22---0----1----2--..
```

当 mergeAll 传入参数后，就会等处理中的其中一个 observable 完成，再去处理下一个。以我们的例子来说，前面两个 observabel 可以被并行处理，但第三个 observable 必须等到第一个 observable 结束后，才会开始。

我们可以利用这个参数来决定要同时处理几个 observable，如果我们传入 1 其行为就会跟 concatAll 是一模一样的，这点在原始码可以看到他们是完全相同的。

## concatMap

concatMap 其实就是 map 加上 concatAll 的简化写法，我们直接来看一个示例

```js
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .map(e => Rx.Observable.interval(1000).take(3))
                .concatAll();

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

上面这个示例就可以简化成

```js
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .concatMap(
                    e => Rx.Observable.interval(100).take(3)
                );

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

前后两个行为是一致的，记得 concatMap 也会先处理前一个送出的 observable 在处理下一个 observable，画成 Marble Diagram 如下

```
source : -----------c--c------------------...
        concatMap(c => Rx.Observable.interval(100).take(3))
example: -------------0-1-2-0-1-2---------...
```

这样的行为也很常被用在发送 request 如下

```js
function getPostData() {
    return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => res.json())
}
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source.concatMap(
                    e => Rx.Observable.from(getPostData()));

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

这里我们每点击一下画面就会送出一个 HTTP request，如果我们快速的连续点击，大家可以在开发者工具的 network 看到每个 request 是等到前一个 request 完成才会送出下一个 request

从 network 的图形可以看得出来，第二个 request 的发送时间是接在第一个 request 之后的，我们可以确保每一个 request 会等前一个 request 完成才做处理。

concatMap 还有第二个参数是一个 selector callback，这个 callback 会传入四个参数，分别是

1. 外部 observable 送出的元素
2. 内部 observable 送出的元素
3. 外部 observable 送出元素的 index
4. 内部 observable 送出元素的 index

回传值我们想要的值，示例如下

```js
function getPostData() {
    return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => res.json())
}
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source.concatMap(
                e => Rx.Observable.from(getPostData()), 
                (e, res, eIndex, resIndex) => res.title);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

这个示例的外部 observable 送出的元素就是 click event 实例，内部 observable 送出的元素就是 response 实例，这里我们回传 response 实例的 title 属性，这样一来我们就可以直接收到 title，这个方法很适合用在 response 要选取的值跟前一个事件或顺位(index)相关时。

## switchMap

switchMap 其实就是 map 加上 switch 简化的写法，如下

```js
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .map(e => Rx.Observable.interval(1000).take(3))
                .switch();

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

上面的代码可以简化成

```js
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .switchMap(
                    e => Rx.Observable.interval(100).take(3)
                );

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

画成 Marble Diagram 表示如下

```
source : -----------c--c-----------------...
        concatMap(c => Rx.Observable.interval(100).take(3))
example: -------------0--0-1-2-----------...
```

只要注意一个重点 switchMap 会在下一个 observable 被送出后直接退订前一个未处理完的 observable，这个部份的细节请看上一篇文章 switch 的部分。

另外我们也可以把 switchMap 用在发送 HTTP request

```js
function getPostData() {
    return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => res.json())
}
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source.switchMap(
                    e => Rx.Observable.from(getPostData()));

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

虽然我们发送了多个 request 但最后真正印出来的 log 只会有一个，代表前面发送的 request 已经不会造成任何的 side-effect 了，这个很适合用在只看最后一次 request 的情境，比如说 自动完成(auto complete)，我们只需要显示使用者最后一次打在画面上的文字，来做建议选项而不用每一次的。

switchMap 跟 concatMap 一样有第二个参数 selector callback 可用来回传我们要的值，这部分的行为跟 concatMap 是一样的，这里就不再赘述。

## mergeMap

mergeMap 其实就是 map 加上 mergeAll 简化的写法，如下

```js
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .map(e => Rx.Observable.interval(1000).take(3))
                .mergeAll();

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

上面的代码可以简化成

```js
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .mergeMap(
                    e => Rx.Observable.interval(100).take(3)
                );

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

画成 Marble Diagram 表示

```
source : -----------c-c------------------...
        concatMap(c => Rx.Observable.interval(100).take(3))
example: -------------0-(10)-(21)-2----------...
```

记得 mergeMap 可以并行处理多个 observable，以这个例子来说当我们快速点按两下，元素发送的时间点是有机会重叠的，这个部份的细节大家可以看上一篇文章 merge 的部分。

mergeMap 也能传入第二个参数 selector callback，这个 selector callback 跟 concatMap 第二个参数也是完全一样的，但 mergeMap 的重点是我们可以传入第三个参数，来限制并行处理的数量

```js
function getPostData() {
    return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => res.json())
}
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source.mergeMap(
                e => Rx.Observable.from(getPostData()), 
                (e, res, eIndex, resIndex) => res.title, 3);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

## switchMap, mergeMap, concatMap

这三个 operators 还有一个共同的特性，那就是这三个 operators 可以把第一个参数所回传的 promise 实例直接转成 observable，这样我们就不用再用 Rx.Observable.from 转一次，如下

```js
function getPersonData() {
    return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => res.json())
}
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source.concatMap(e => getPersonData());
                                    //直接回传 promise 实例

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

至於在使用上要如何选择这三个 operators？ 其实都还是看使用情境而定，这里笔者简单列一下大部分的使用情境

- concatMap 用在可以确定内部的 observable 结束时间比外部 observable 发送时间来快的情境，并且不希望有任何并行处理行为，适合少数要一次一次完成到底的的 UI 动画或特别的 HTTP request 行为。
- switchMap 用在只要最后一次行为的结果，适合绝大多数的使用情境。
- mergeMap 用在并行处理多个 observable，适合需要并行处理的行为，像是多个 I/O 的并行处理。

> 建议初学者不确定选哪一个时，使用 switchMap。在使用 concatAll 或 concatMap 时，请注意内部的 observable 一定要能够的结束，且外部的 observable 发送元素的速度不能比内部的 observable 结束时间快太多，不然会有 memory issues

## window

window 是一整个家族，总共有五个相关的 operators

- window
- windowCount
- windowTime
- windowToggle
- windowWhen

这里我们只介绍 window 跟 windowToggle 这两个方法，其他三个的用法相对都简单很多，大家如果有需要可以再自行到官网查看。

window 很类似 buffer 可以把一段时间内送出的元素拆出来，只是 buffer 是把元素拆分到数组中变成

```
Observable<T> => Observable<Array<T>>
```

而 window 则是会把元素拆分出来放到新的 observable 变成

```
Observable<T> => Observable<Observable<T>>
```

buffer 是把拆分出来的元素放到数组并送出数组；window 是把拆分出来的元素放到 observable 并送出 observable，让我们来看一个例子

```js
var click = Rx.Observable.fromEvent(document, 'click');
var source = Rx.Observable.interval(1000);
var example = source.window(click);

example
  .switch()
  .subscribe(console.log);
// 0
// 1
// 2
// 3
// 4
// 5 ...
```

首先 window 要传入一个 observable，每当这个 observable 送出元素时，就会把正在处理的 observable 所送出的元素放到新的 observable 中并送出，这里看 Marble Diagram 会比较好解释

```
click  : -----------c----------c------------c--
source : ----0----1----2----3----4----5----6---..
                    window(click)
example: o----------o----------o------------o--
         \          \          \
          ---0----1-|--2----3--|-4----5----6|
                    switch()
       : ----0----1----2----3----4----5----6---... 
```

这里可以看到 example 变成发送 observable 会在每次 click 事件发送出来后结束，并继续下一个 observable，这里我们用 switch 才把它摊平。

当然这个范例只是想单存的表达 window 的作用，没什么太大的意义，实务上 window 会搭配其他的 operators 使用，例如我们想计算一秒钟内触发了几次 click 事件

```js
var click = Rx.Observable.fromEvent(document, 'click');
var source = Rx.Observable.interval(1000);
var example = click.window(source)

example
  .map(innerObservable => innerObservable.count())
  .switch()
  .subscribe(console.log);
```

注意这里我们把 source 跟 click 对调了，并用到了 observable 的一个方法 count()，可以用来取得 observable 总共送出了几个元素，用 Marble Diagram 表示如下

```
source : ---------0---------1---------2--...
click  : --cc---cc----c-c----------------...
                    window(source)
example: o--------o---------o---------o--..
         \        \         \         \
          -cc---cc|---c-c---|---------|--..
                    count()
       : o--------o---------o---------o--
         \        \         \         \
          -------4|--------2|--------0|--..
                    switch()
       : ---------4---------2---------0--... 
```

从 Marble Diagram 中可以看出来，我们把部分元素放到新的 observable 中，就可以利用 Observable 的方法做更灵活的操作

## windowToggle

windowToggle 不像 window 只能控制内部 observable 的结束，windowToggle 可以传入两个参数，第一个是开始的 observable，第二个是一个 callback 可以回传一个结束的 observable，让我们来看范例

```js
var source = Rx.Observable.interval(1000);
var mouseDown = Rx.Observable.fromEvent(document, 'mousedown');
var mouseUp = Rx.Observable.fromEvent(document, 'mouseup');

var example = source
  .windowToggle(mouseDown, () => mouseUp)
  .switch();

example.subscribe(console.log);
```

一样用 Marble Diagram 会比较好解释

```
source   : ----0----1----2----3----4----5--...

mouseDown: -------D------------------------...
mouseUp  : ---------------------------U----...

        windowToggle(mouseDown, () => mouseUp)

         : -------o-------------------------...
                  \
                   -1----2----3----4--|
                   switch()
example  : ---------1----2----3----4---------...     
```

从 Marble Diagram 可以看得出来，我们用 windowToggle 拆分出来内部的 observable 始于 mouseDown 终于 mouseUp。

## groupBy

最后我们来讲一个开发上比较常用的 operators - groupBy，它可以帮我们把相同条件的元素拆分成一个 Observable，其实就跟平常在 SQL 下是一样个概念，我们先来看个简单的例子

```js
var source = Rx.Observable.interval(300).take(5);

var example = source
              .groupBy(x => x % 2);

example.subscribe(console.log);

// GroupObservable { key: 0, ...}
// GroupObservable { key: 1, ...}
```

上面的例子，我们传入了一个 callback function 并回传 groupBy 的条件，就能区分每个元素到不同的 Observable 中，用 Marble Diagram 表示如下

```
source : ---0---1---2---3---4|
             groupBy(x => x % 2)
example: ---o---o------------|
            \   \
            \   1-------3----|
            0-------2-------4|
```

在实际上，我们可以拿 groupBy 做完元素的区分后，再对 inner Observable 操作，例如下面这个例子我们将每个人的分数作加总再送出

```js
var people = [
    {name: 'Anna', score: 100, subject: 'English'},
    {name: 'Anna', score: 90, subject: 'Math'},
    {name: 'Anna', score: 96, subject: 'Chinese' }, 
    {name: 'Jerry', score: 80, subject: 'English'},
    {name: 'Jerry', score: 100, subject: 'Math'},
    {name: 'Jerry', score: 90, subject: 'Chinese' }, 
];
var source = Rx.Observable.from(people)
						   .zip(
						     Rx.Observable.interval(300), 
						     (x, y) => x);

var example = source
  .groupBy(person => person.name)
  .map(group => group.reduce((acc, curr) => ({ 
	    name: curr.name,
	    score: curr.score + acc.score 
	})))
	.mergeAll();

example.subscribe(console.log);
// { name: "Anna", score: 286 }
// { name: 'Jerry', score: 270 }
```

这里我们范例是想把 Jerry 跟 Anna 的分数个别作加总，画成 Marble Diagram 如下

```
source : --o--o--o--o--o--o|

  groupBy(person => person.name)

       : --i--------i------|
           \        \
           \         o--o--o|
            o--o--o--|

	   map(group => group.reduce(...))

       : --i---------i------|
           \         \
           o|        o|

             mergeAll()
example: --o---------o------| 
```

一些涉及到Subject的操作符 ~ 会马上整理出来滴 冲冲冲。