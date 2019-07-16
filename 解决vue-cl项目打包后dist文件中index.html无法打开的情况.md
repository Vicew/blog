---
title: 解决vue-cl项目打包后dist文件中index.html无法打开的情况
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

Well Done!
