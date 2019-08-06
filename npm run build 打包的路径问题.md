---
title: npm run build 打包的路径问题
date: 2019-07-16 16:56:39
tags: webpack
categories: webpack
---

项目完成，直接执行`npm run build`，ok，出现了下面的界面，真是开心

![打包成功](http://blog.panxiandiao.com/20190716170553.png)

兴高采烈的打开

![index.html](http://blog.panxiandiao.com/20190716171009.png)

嚯

![报错](http://blog.panxiandiao.com/20190716171624.png)

打开build打包配置文件看一下呀

![配置文件](http://blog.panxiandiao.com/20190716172236.png)

`assetsPublicPath`: 代表打包后，index.html里面引用资源的的相对地址

所以我们把`/`改成当前目录`./`就好啦

![成功](http://blog.panxiandiao.com/20190716172527.png)

为啥会出错？我们看下脚手架目录

![index.js](http://blog.panxiandiao.com/20190806092623.png)

有个config文件夹，在index.js中有两个方法一个开发dev,一个生产build

- dev： 是我们的开发环境，资源使用绝对路径，所以可以正常看到背景图片
- build： 是我们的生产环境，资源使用相对路径，所以会报错