---
title: Observable 与一些 Subject
date: 2020-06-11 14:41:22
tags: Rxjs
categories: Rxjs
---

在RxJS中有四种Subject分别是：Subject，BehaviorSubject，AsyncSubject，ReplaySubject；这四种Subject都是特殊的Observable。

在介绍它们之前，我们先来看下这四种Subject与普通Observable的区别：

![区别对照](blog.panxiandiao.com/20200611144240.png)

## Cold vs Hot

Observable对象就是一个数据流，可以在一个时间范围内吐出一系列数据，如果只存在一个Observable，一切都很简单，但是对于存在多个Observable的场景，情况就变得复杂了。

假设有这样的场景，一个Observable对象有两个Observer对象来订阅，而且这两个Observer对象并不是同时订阅，第一个Observer对象订阅N秒钟之后，第二个Observer对象才订阅同一个Observable对象，而且，在这N秒钟之内
，Observable对象已经吐出了一些数据。那么问题来了，后订阅上的Observer，是不是应该接收到“错过”的那些数据呢？

- 选择A：错过就错过了，只需要接受从订阅那一刻开始Observable产生的数据就行了。
- 选择B：不能错过，需要获取Observable之前产生的数据

应该选择A还是选B，没有定论，针对不同的应用场景，完全会有不同的期望结果。

非常现实的例子，电视台的任何一个频道的节目如果看作是一个Observable对象，那么每一台电视机就是一个Observer，当你打开电视切换到某个频道，你所看到的节目内容就是
从那一刻开始的，不包含之前的内容，所以，对于电视这个场景，恰当的答案是选择A

当然我们还有一些视频点播的网站，当你从浏览器中打开某个电视剧的某一集，就是从这一集的第一秒钟开始播放，另一个用户在另一个时间另一台电脑上打开同样的剧集，也是从第一秒钟开始
播放，互相没有影响，这就是选择B

Rxjs已经考虑到了这两种不同场景的特点，让Observable支持这两种不同的需求，对应于选择A，称这样的Observable为Hot Observable，对于选择B，称这样的Observable为Cold Observable。

### Observable多次订阅

```js
var source = Rx.Observable.interval(1000).take(3);

var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}

source.subscribe(observerA);
source.subscribe(observerB);

// "A next: 0"
// "B next: 0"
// "A next: 1"
// "B next: 1"
// "A next: 2"
// "A complete!"
// "B next: 2"
// "B complete!"
```

上面这段代码，分别用 observerA 跟 observerB 订阅了 source，从 log 可以看出来 observerA 跟 observerB 都各自收到了元素，但请记得这两个 observer 其实是分开执行的也就是说他们是完全独立的，我们把 observerB 延迟订阅来证明看看

```js
var source = Rx.Observable.interval(1000).take(3);

var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}

source.subscribe(observerA);
setTimeout(() => {
    source.subscribe(observerB);
}, 1000);

// "A next: 0"
// "A next: 1"
// "B next: 0"
// "A next: 2"
// "A complete!"
// "B next: 1"
// "B next: 2"
// "B complete!"
```

这里我们延迟一秒再用 observerB 订阅，可以从 log 中看出 1 秒后 observerA 已经印到了 1，这时 observerB 开始印却是从 0 开始，而不是接着 observerA 的进度，
代表这两次的订阅是完全分开来执行的，或者说是每次的订阅都建立了一个新的执行。这样的行为在大部分的情境下适用，但有些案例下我们会希望第二次订阅 source 不会从头开始接收元素，
而是从第一次订阅到当前处理的元素开始发送。

### 手动建立 subject

其实我们可以建立一个中间人来订阅 source 再由中间人转送资料出去，就可以达到我们想要的效果

```js
var source = Rx.Observable.interval(1000).take(3);

var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}

var subject = {
    observers: [],
    addObserver: function(observer) {
        this.observers.push(observer)
    },
    next: function(value) {
        this.observers.forEach(o => o.next(value))    
    },
    error: function(error){
        this.observers.forEach(o => o.error(error))
    },
    complete: function() {
        this.observers.forEach(o => o.complete())
    }
}

subject.addObserver(observerA)

source.subscribe(subject);

setTimeout(() => {
    subject.addObserver(observerB);
}, 1000);

// "A next: 0"
// "A next: 1"
// "B next: 1"
// "A next: 2"
// "B next: 2"
// "A complete!"
// "B complete!"
```

从上面的代码可以看到，我们先建立了一个实例叫 subject，这个实例具备 observer 所有的方法(next, error, complete)，并且还能 addObserver 把 observer 加到内部的清单中，
每当有值送出就会遍历清单中的所有 observer 并把值再次送出，这样一来不管多久之后加进来的 observer，都会是从当前处理到的元素接续往下走，就像范例中所示，
我们用 subject 订阅 source 并把 observerA 加到 subject 中，一秒后再把 observerB 加到 subject，这时就可以看到 observerB 是直接收 1 开始，这就是多播(multicast)的行为。

让我们把 subject 的 addObserver 改名成 subscribe 如下

```js
var subject = {
    observers: [],
    subscribe: function(observer) {
        this.observers.push(observer)
    },
    next: function(value) {
        this.observers.forEach(o => o.next(value))    
    },
    error: function(error){
        this.observers.forEach(o => o.error(error))
    },
    complete: function() {
        this.observers.forEach(o => o.complete())
    }
}
```

虽然上面是我们自己手写的 subject，但运行方式跟 RxJS 的 Subject 实例是几乎一样的，我们把前面的代码改成 RxJS 提供的 Subject 试试

```js
var source = Rx.Observable.interval(1000).take(3);

var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}

var subject = new Rx.Subject()

subject.subscribe(observerA)

source.subscribe(subject);

setTimeout(() => {
    subject.subscribe(observerB);
}, 1000);

// "A next: 0"
// "A next: 1"
// "B next: 1"
// "A next: 2"
// "B next: 2"
// "A complete!"
// "B complete!"
```

大家会发现使用方式跟前面是相同的，建立一个 subject 先拿去订阅 observable(source)，再把我们真正的 observer 加到 subject 中，这样一来就能完成订阅，而每个加到 subject 中的 observer 都能整组的接收到相同的元素。

### 什么是 Subject?

虽然前面我们已经示范直接手写一个简单的 subject，但到底 RxJS 中的 Subject 的概念到底是什么呢？

首先 Subject 可以拿去订阅 Observable(source) 代表他是一个 Observer，同时 Subject 又可以被 Observer(observerA, observerB) 订阅，代表他是一个 Observable。

总结成两句话

- Subject 同时是 Observable 又是 Observer
- Subject 会对内部的 observers 清单进行多播(multicast)

## 数据生产者 vs 数据消费者

- 数据生产者是指Observable(可观察对象)，产生数据的一方。
- 数据消费者是指Observers(观察者)，接收数据的一方。

## BehaviorSubject

BehaviorSubject 是 Subject 的变体之一。**BehaviorSubject 的特性就是它会存储“当前”的值。这意味着你始终可以直接拿到 BehaviorSubject 最后一次发出的值**

有两种方法可以拿到 BehaviorSubject “当前”的值：访问其 `.value` 属性或者直接订阅。如果你选择了订阅，那么 BehaviorSubject 将直接给订阅者发送当前存储的值，无论这个值有多么“久远”。请看下面的例子：

```js
import * as Rx from "rxjs";

const subject = new Rx.BehaviorSubject(Math.random());

// 订阅者 A
subject.subscribe((data) => {
  console.log('Subscriber A:', data);
});

subject.next(Math.random());

// 订阅者 B
subject.subscribe((data) => {
  console.log('Subscriber B:', data);
});

subject.next(Math.random());

console.log(subject.value)

// 输出
// Subscriber A: 0.24957144215097515
// Subscriber A: 0.8751123892486292
// Subscriber B: 0.8751123892486292
// Subscriber A: 0.1901322109907977
// Subscriber B: 0.1901322109907977
// 0.1901322109907977
```

详细讲解一下：

1. 我们首先创建了一个 subject，并在其中注册了一个订阅者A。由于 subject 是一个 BehaviorSubject，所以订阅者A 会立即收到 subject 的初始值（一个随机数），并同时将其打印。
2. subject 随即广播下一个值。订阅者A 再次打印收到的值。
3. 第二次订阅 subject 并称其为订阅者B。同样，订阅者B 也会立即收到 subject 当前存储的值并打印。
4. subject 再次广播下一个新的值。这时，两个订阅者都会收到这个值并打印。
5. 最后，我们通过简单地访问 `.value` 属性的形式获取了 subject 当前的值并打印。这在同步的场景下非常好用，因为你不必订阅 Subject 就可以获取它的值。

另外，你可能发现了 BehaviorSubject 在创建时是需要设置一个初始值的。这一点在 Observable 上就非常难实现，而在 BehaviorSubject 上，只要传递一个值就行了。

## ReplaySubject

相比 BehaviorSubject 而言，ReplaySubject 是可以给新订阅者发送“旧”数据的。另外，ReplaySubject 还有一个额外的特性就是它可以记录一部分的 observable execution，从而存储一些旧的数据用来“重播”给新来的订阅者。

当创建 ReplaySubject 时，你可以指定存储的数据量以及数据的过期时间。也就是说，你可以实现：给新来的订阅者“重播”订阅前一秒内的最后五个已广播的值。示例代码如下：

```js
import * as Rx from "rxjs";

const subject = new Rx.ReplaySubject(2);

// 订阅者 A
subject.subscribe((data) => {
  console.log('Subscriber A:', data);
});

subject.next(Math.random())
subject.next(Math.random())
subject.next(Math.random())

// 订阅者 B
subject.subscribe((data) => {
  console.log('Subscriber B:', data);
});

subject.next(Math.random());

// Subscriber A: 0.3541746356538569
// Subscriber A: 0.12137498878080955
// Subscriber A: 0.531935186034298
// Subscriber B: 0.12137498878080955
// Subscriber B: 0.531935186034298
// Subscriber A: 0.6664809293975393
// Subscriber B: 0.6664809293975393
```

简单解读一下代码：

1. 我们创建了一个 ReplaySubject 并指定其只存储最近两次广播的值；
2. 订阅 subject 并称其为订阅者A；
3. subject 连续广播三次，同时订阅者A 也会跟着连续打印三次；
4. 这一步就轮到 ReplaySubject 展现魔力了。我们再次订阅 subject 并称其为订阅者B，因为之前我们指定 subject 存储最近两次广播的值，所以 subject 会将上两个值“重播”给订阅者B。我们可以看到订阅者B 随即打印了这两个值；
5. subject 最后一次广播，两个订阅者收到值并打印。

之前提到了你还可以设置 ReplaySubject 的数据过期时间。让我们来看看下面这个例子：

```js
import * as Rx from "rxjs";

const subject = new Rx.ReplaySubject(2, 100);

// 订阅者A
subject.subscribe((data) => {
  console.log('Subscriber A:', data);
});

setInterval(() => subject.next(Math.random()), 200);

// 订阅者B
setTimeout(() => {
  subject.subscribe((data) => {
    console.log('Subscriber B:', data);
  });
}, 1000)

// Subscriber A: 0.44524184251927656
// Subscriber A: 0.5802631630066313
// Subscriber A: 0.9792165506699135
// Subscriber A: 0.3239616040117268
// Subscriber A: 0.6845077617520203
// Subscriber B: 0.6845077617520203
// Subscriber A: 0.41269171141525707
// Subscriber B: 0.41269171141525707
// Subscriber A: 0.8211466186035139
// Subscriber B: 0.8211466186035139
```

同样解读一下代码：

1. 我们创建了一个 ReplaySubject，指定其存储最近两次广播的值，但只保留 100ms；
2. 订阅 subject 并称其为订阅者A；
3. 我们让这个 subject 每 200ms 广播一次。订阅者A 每次都会收到值并打印；
4. 我们设置在程序执行一秒后再次订阅 subject，并称其为订阅者B。这意味着在它开始订阅之前，subject 就已经广播过五次了。由于我们在创建 subject 时就设置了数据的过期时间为 100ms，而广播间隔为 200ms，所以订阅者B 在开始订阅后只会收到前五次广播中最后一次的值。

## AsyncSubject

BehaviorSubject 和 ReplaySubject 都可以用来存储一些数据，而 AsyncSubject 就不一样了。AsyncSubject 只会在 Observable execution 完成后，将其最终值发给订阅者。请看代码：

```js
import * as Rx from "rxjs";

const subject = new Rx.AsyncSubject();

// 订阅者A
subject.subscribe((data) => {
  console.log('Subscriber A:', data);
});

subject.next(Math.random())
subject.next(Math.random())
subject.next(Math.random())

// 订阅者B
subject.subscribe((data) => {
  console.log('Subscriber B:', data);
});

subject.next(Math.random());
subject.complete();

// Subscriber A: 0.4447275989704571
// Subscriber B: 0.4447275989704571
```

我们解读一下：

1. 创建 AsyncSubject；
2. 订阅 subject 并称其为订阅者A；
3. subject 连续广播三次，但什么也没发生；
4. 再次订阅 subject 并称其为订阅者B；
5. subject 又广播了一次，但还是什么也没发生；
6. subject 完成。两个订阅者这才收到传来的值并打印至终端。
