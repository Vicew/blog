---
title: flex 属性
date: 2019-08-30 10:11:38
tags: 前端
categories: 前端
---

被flex属性搞的晕头转向，在此做个记录总结

flex 属性用于设置或检索弹性盒模型对象的子元素如何分配空间。

flex 属性是 flex-grow、flex-shrink 和 flex-basis 属性的简写属性。

**注意：如果元素不是弹性盒模型对象的子元素，则 flex 属性不起作用。**

## flex-grow

flex-grow 属性用于设置或检索弹性盒子的扩展比率

![flex-grow](http://blog.panxiandiao.com/20190830152105.png)

![flex-grow](http://blog.panxiandiao.com/20190830152134.png)

相当于把整个flex容器按照宽度平均分成了 1 + 3 + 1 = 5块 每个子元素根据自身flex-grow的值来获得多少块的自身宽度

## flex-shrink

![flex-shrink](http://blog.panxiandiao.com/20190830172621.png)

flex-shrink的默认值为1，如果没有显示定义该属性，将会自动按照默认值1在所有因子相加之后计算比率来进行空间收缩。

本例中A、B、C 显式定义了 flex-shrink 为 1，D、E 定义了 flex-shrink 为 2，所以计算出来总共将剩余空间分成了 7 份，其中 A、B、C 占 1 份，D、E 占 2 份，即1:1:1:2:2

我们可以看到父容器定义为 500px，子项被定义为 120px，子项相加之后即为 600 px，超出父容器 100px。那么超出的 100px 需要被 A、B、C、D、E 消化 通过收缩因子，所以加权综合可得 100*1+100*1+100*1+100*2+100*2=700px。

于是我们可以计算 A、B、C、D、E 将被移除的溢出量是多少：

A 被移除溢出量：(100*1/700)*100，即约等于14px

B 被移除溢出量：(100*1/700)*100，即约等于14px

C 被移除溢出量：(100*1/700)*100，即约等于14px

D 被移除溢出量：(100*2/700)*100，即约等于28px

E 被移除溢出量：(100*2/700)*100，即约等于28px

最后A、B、C、D、E的实际宽度分别为：120-14=106px, 120-14=106px, 120-14=106px, 120-28=92px,120-28=92px，此外，这个宽度是包含边框的

## flex-basis

flex-basis 属性用于设置或检索弹性盒伸缩基准值（也就是设置宽度）

![flex-basis](http://blog.panxiandiao.com/20190831103819.png)

flex-grow 和 flex-shrink 都设为0代表 不按照父容器进行收缩扩展

![flex-basis](http://blog.panxiandiao.com/20190831110734.png)

## 动画属性

没想到叭 flex 属性 也能用 `animation`

### animation-flex-basis

![flex-basis](http://blog.panxiandiao.com/20190901213817.png)

"蓝色 DIV" 的 flex-basis 属性逐渐地从 40px 变化到 200px，然后再变回来

### animation-flex-shrink

![flex-shrink](http://blog.panxiandiao.com/20190901215219.png)

"blue DIV" 的 flex-shrink 属性逐渐地从 1 变化到 8，然后再变回 1

### animation-flex-grow

![flex-grow](http://blog.panxiandiao.com/20190901215411.png)

"blue DIV" 的 flex-grow 属性逐渐地从 1 变化到 8，然后再变回 1

## 使用到的场景

![数空](http://blog.panxiandiao.com/20190901215624.png)

大部分人实现这样的布局一般都是父元素设置flex布局，然后    `align-items: center`垂直居中，`justify-content: space-between`两端对齐，项目之间的间隔都相等.然后对中间的元素设置`margin-right`。还有没有更简单的方法呢？

中间的元素是弹性盒模型对象的子元素，并且此时的元素的flex是默认的0, 1, auto 也就是flex-grow的值为0，上面说过就不会按照父容器进行扩展，所以只会呈现他们默认的宽度

![flex-grow:1](http://blog.panxiandiao.com/20190902213427.png)

那么我们自然而然的就想到对中间元素设置`flex-grow:1`，那么这个元素就会占满父容器的剩余空间啦~

{% raw %}
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="demo-transition">
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
</script>
<style>
.demo-transition-enter-active, .demo-transition-leave-active {
  transition: opacity .5s
}
.demo-transition-enter, .demo-transition-leave-to {
  opacity: 0
}
</style>
{% endraw %}

333