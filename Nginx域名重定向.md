---
title: Nginx域名重定向
date: 2019-05-12 14:00:38
tags: Nginx
categories: Nginx
---

## 为什么要Nginx域名重定向

我们都知道一级域名比二级域名权重更高一些，一级域名比二级域名更有优势,但是因为用户的习惯，一个带`www`的网站比不带的更具有权威性，所以我们的网站要带上`www`

`xx.com`是一级域名，而它之前的任何名称，比如`blog.xx.com`都是二级域名。 因此`www.xx.com`也是个二级域名，只不过是一个比较特殊的二级域名罢了。

**虽然内容一样，但是还是两个不同的网站，比如你的博客有统计人数的功能，他是根据访问网站来统计的，当然也就不能互通，两个网站的人数统计就完全不同**

那么我们要处理输入网址或者跳转没有前缀的网址让他跳转到带有`www`的网址

## 简单熟悉Nginx配置文件

![配置文件](http://blog.panxiandiao.com/20190512143105.png)

`sites-available`目录中有所有的（N个站点）配置，包括临时不启用的站点，将启用的站点通过软链接链到`sites-enabled`目录中

`sites-enabled`目录中下是当前启用的站点，方便快速启用，停用并且进行管理

我们在`sites-available`创建一个你要管理的站点并且软链到`sites-enabled`，我们在`sites-enabled`中编辑配置

## 编辑配置文件

**可以直接删除`default`默认配置文件**

![配置](http://blog.panxiandiao.com/20190512191902.png)

最后别忘了重启`Nginx`

```Linux
    nginx -s reload
```

Well Done