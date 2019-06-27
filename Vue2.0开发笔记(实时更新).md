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
6. `Jsonp`解决跨域问题，他发送的不是`ajax`请求,他是动态创建了一个 &#60;script&#62;这个标签不受同源策略的限制
7. 对象的遍历用`for in`
8. 在一个文件或模块中，export、import可以有多个，export default仅有一个
9. 通过export方式导出，在导入时要加{ }，export default则不需要
10. 浏览器的17毫秒的刷新
11. ref如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例,当 v-for 用于元素或组件的时候，引用信息将是包含 DOM 节点或组件实例的数组。
12. 通过 `Prop` 向子组件传递数据
13. 为什么要用`slot`?既然你用了子组件，你为什么要给她传一些dom，直接去定义复用的子组件不就好了。后来想想觉得一个复用的组件在不同的地方只有些许变化，如果去重写子组件是很不明智的一件事，当然也可以将不同之处都写在子组件里，然后通过父组件传来的标识进行选择显示。其实质是对子组件的扩展，通过slot插槽向组件内部指定位置传递内容，即将\<slot\>\</slot\>元素作为承载分发内容的出口；
14. ![better-scroll配制](http://blog.panxiandiao.com/20190616181146.png)
15. 初始化better-scroll的时候它会拷贝开头一份放在结尾，结尾一份放在开头
16. :class {} true的时候实现样式
17. 组件里面有计时器这种资源的时候，在组件销毁的时候要对计时器进行清理，有利于内存的释放
18. 请求头`host refer`限制访问权限，可以通过后端代理来解决修改请求头
19. 加冒号的，说明后面的是一个变量或者表达式，没加冒号的后面就是对应的字符串字面量
20. `npx eslint --ext .js,.vue --ignore-path .gitignore --ignore-path .eslintignore .`显示错误格式的文件（ESLINT）
21. `npx eslint --ext .js,.vue --ignore-path .gitignore --ignore-path .eslintignore . --fix`整个项目更正
22. vscode的自身语法检查有问题，一般都把 `"javascript.validate.enable": false`禁用默认的 js 验证，所以采用了`ESlint`.
23. window.reload是重新加载当前需要的所有内容，也就包括页面和后台的代码，此过程中实际上是从后台重新进行操作；window.Refresh是刷新，保留之前的缓存内容，重新加载页面，之前存在的东西不会动，没加载上来的东西继续加载，也会去加载后台代码内容的
24. 