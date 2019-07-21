---
title: 样式穿透和scoped的坑
date: 2019-07-20 23:38:39
tags: Vue2.0
categories: Vue2.0
---

## scoped属性

慕课网上一直看的是黄老师的课程，所以自己开发的时候写css就会加上scoped,虽然不知道有什么作用

![scoped](http://blog.panxiandiao.com/20190721120507.png)

开发着开发着你会发现一个巨大的问题，如果在当前组件中的样式里要修改另一个公共组件的样式时，你会发现重写失败，打开浏览器开发者工具你会发现你要修改的组件的样式根本没有被写入，在问了大佬后，才知道是`scoped`属性出了问题

在vue组件中，在style标签上添加scoped属性，以表示它的样式作用于当下的模块，很好的实现了样式私有化的目的，这是一个非常好的机制。也就是说加上了它就不能修改其他其他公共组件的样式

**在实际业务中我们往往会对公共组件样式做细微的调整，如果添加了scoped属性，那么样式将会变得不易修改**

## 样式穿透

但是有时候我就想用上scoped保证私有化，然后又想修改公共组件的样式，怎么办？有没有办法？这里就可以用样式穿透的方法

1. `stylus`的样式穿透 使用 `>>>`

```css
  .wrapper >>> .swiper-pagination-bullet-active
  background: #fff
```

2. sass和less的样式穿透 使用 `/deep/`

```css
  .wrapper /deep/ .swiper-pagination-bullet-active{
    background: #fff;
  }
```

