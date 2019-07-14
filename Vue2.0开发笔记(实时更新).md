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
10. 浏览器的17毫秒的刷新率,数据变化到dom变化需要事件
11. ref如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例,当 v-for 用于元素或组件的时候，引用信息将是包含 DOM 节点或组件实例的数组。
12. 通过 `Prop` 向子组件传递数据
13. 为什么要用`slot`?既然你用了子组件，你为什么要给她传一些dom，直接去定义复用的子组件不就好了。后来想想觉得一个复用的组件在不同的地方只有些许变化，如果去重写子组件是很不明智的一件事，当然也可以将不同之处都写在子组件里，然后通过父组件传来的标识进行选择显示。其实质是对子组件的扩展，通过slot插槽向组件内部指定位置传递内容，即将\<slot\>\</slot\>元素作为承载分发内容的出口；
14. ![better-scroll配制](http://blog.panxiandiao.com/20190616181146.png)
15. 初始化`better-scroll`的时候它会拷贝开头一份放在结尾，结尾一份放在开头
16. :class {} true的时候实现样式
17. 组件里面有计时器这种资源的时候，在组件销毁的时候要对计时器进行清理，有利于内存的释放
18. 请求头`host refer`限制访问权限，可以通过后端代理来解决修改请求头
19. 加冒号的，说明后面的是一个变量或者表达式，没加冒号的后面就是对应的字符串字面量
20. `npx eslint --ext .js,.vue --ignore-path .gitignore --ignore-path .eslintignore .`显示错误格式的文件（ESLINT）
21. `npx eslint --ext .js,.vue --ignore-path .gitignore --ignore-path .eslintignore . --fix`整个项目更正
22. vscode的自身语法检查有问题，一般都把 `"javascript.validate.enable": false`禁用默认的 js 验证，所以采用了`ESlint`.
23. window.reload是重新加载当前需要的所有内容，也就包括页面和后台的代码，此过程中实际上是从后台重新进行操作；window.Refresh是刷新，保留之前的缓存内容，重新加载页面，之前存在的东西不会动，没加载上来的东西继续加载，也会去加载后台代码内容的
24. `box-sizing: border-box;`整个盒子除了`margin`的大小就是设置长宽的大小，`content，border,padding`嵌入里面
25. `jusify-content: center;`实现水平居中 `align-items: center;` 实现垂直居中
26. `created:html`加载完成之前，执行。执行顺序：父组件-子组件,`mounted:html`加载完成后执行。执行顺序：子组件-父组件
27. `@load` 图片有值的时候就加载 `onload`事件是在`src`的资源加载完毕的时候，才会触发
28. ``内用$来将连接字符串
29. `v-if` 呢如果条件为`false`，那么在生成的`HTML`语句中，条件为`false`的标签不会生成在代码中.`v-show`呢如果条件为`false`，运行后，还是生成了条件为`false`所在的标签，但是只是让其`display属性为none`，即该标签不进行显示
30. 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的
31. 使用 data-* 属性来嵌入自定义数据
32. ref 加在普通的元素上，用this.$refs.（ref值） 获取到的是dom元素.ref 加在子组件上，用this.$refs.（ref值） 获取到的是组件实例，可以使用组件的所有方法。在使用方法的时候直接this.$refs.（ref值）.方法（） 就可以使用了。
33. `$emit` [点此进](https://blog.csdn.net/sllailcp/article/details/78595077)
34. 字符&指向父选择器
35. `watch question: function (newQuestion, oldQuestion) {}`
36. 基础组件没业务逻辑（按钮点击的话就派发）
37. 解决路由复杂数据传递（vuex）或者很多的组件共享数据
38. payload [点此进](https://www.jianshu.com/p/1bd78ccab7d2)
39. `import * as`会将若干export导出的内容组合成一个对象返回
40. es6解构赋值 `let {musicData} = item`相当于`let musicData = item.musicData`
41. `:bg-image="bgImage"`
42. css在vue中自动prefix,js的话要自己实现，利用浏览器能力检测
43. `getters.js`中也能写计算属性
44. `click.stop`阻止冒泡，适用于父元素的点击事件
45. 标志位解决点击速度过快audio异步出错的问题
46. 在移动端上点击屏幕时，会依次触发touchstart,touchmove,touchend,click事件。可以通过`preventDefault`来解决事件的默认行为
47. SVG有空在看下  viewbox  width height r cx cy
48. `Math.random()`是令系统随机选取大于等于 0.0 且小于 1.0 的伪随机 double 值