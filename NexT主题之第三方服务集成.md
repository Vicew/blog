---
title: NexT主题之第三方服务集成
date: 2019-05-09 23:22:39
tags: Hexo
categories: Hexo
---

静态站点拥有一定的局限性，因此我们需要借助于第三方服务来扩展站点的功能。 以下是 NexT 目前支持的第三方服务，你可以根据你的需求集成一些功能进来。

## 搜索功能

1. 在博客根目录下执行以下命令

```Linux
    npm install hexo-generator-searchdb --save
```

2. 编辑博客根目录下配置文件`_config.yml`，添加

```Linux
    search:
      path: search.xml
      field: post
      format: html
      limit: 10000
```

3. 编辑主题配置文件`themes/next/_config.yml`

```Linux
    local_search:
      enable: true
```

![搜索](http://blog.panxiandiao.com/20190510114246.png)

## 数据统计与分析

### 百度统计

1. [登录百度站长统计，点击管理新增网站](https://tongji.baidu.com/web/27848365/welcome/login)

![统计](http://blog.panxiandiao.com/20190510122434.png)

2. 点击代码获取复制问号后边的代码（Baidu Analytics ID）

![获取ID](http://blog.panxiandiao.com/20190510122824.png)

3. 编辑主题配置文件`themes/next/_config.yml`

![配置](http://blog.panxiandiao.com/20190510122945.png)

这样子就可以查看我们网站浏览量的具体信息啦

![效果](http://blog.panxiandiao.com/20190510123028.png)

### 不蒜子访问统计博客显示

1. 编辑主题配置文件`themes/next/_config.yml`

![不蒜子](http://blog.panxiandiao.com/20190510123445.png)

箭头指的是`Next`主题支持所有的`Font Awesome`图标，如果需要可以选择自己喜欢的图标显示

[图标官方网址](http://fontawesome.dashgame.com/)

2. 如果博客页面次数未显示，我们编辑不蒜子文件`/next/layout/_third-party/analytics/busuanzi-counter.swig`

把原来的`<script async src="原来的url/busuanzi/2.3/busuanzi.pure.mini.js"></script>`改成`<script async src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>`，因为本身不蒜子域名失效

![不蒜子](http://blog.panxiandiao.com/20190510124159.png)

## Valine评论系统

1. 首先我们一定要有一个平台来管理我们的评论，我们可以用[leancloud](https://leancloud.cn/)

2. 注册完我们创建一个名字叫评论的应用选择开发版就够拉

![创建](http://blog.panxiandiao.com/20190510142045.png)

3. 绑定一下我们的域名

![绑定](http://blog.panxiandiao.com/20190510142308.png)

**特别注意我们输入的安全域名协议、域名和端口号都需严格一致**

4. 记录`App ID`和`App Key`来配置主题配置文件`themes/next/_config.yml`

![配置](http://blog.panxiandiao.com/20190510143006.png)

![配置](http://blog.panxiandiao.com/20190510143131.png)

Well Done!

![成功](http://blog.panxiandiao.com/20190510143229.png)

在`leancloud`中进行管理

![成功](http://blog.panxiandiao.com/20190510143326.png)

## 来个可爱的动漫小人

[点击选择一个你喜欢的动漫并且记录他们的名字](https://huaji8.top/post/live2d-plugin-2.0/)

1. 在博客根目录下执行以下命令

```Linux
    npm install --save hexo-helper-live2d
    npm install --save live2d-widget-model-记录的名字
```

2. 编辑博客根目录下配置文件`_config.yml`，添加

```Linux
   live2d:
     enable: true
     scriptFrom: local
     pluginRootPath: live2dw/
     pluginJsPath: lib/
     pluginModelPath: assets/
     tagMode: false
     log: false
     model:
       use: live2d-widget-model-记录的名字
     display:
       position: right
       width: 150
       height: 300
     mobile:
       show: true
```

![动漫](http://blog.panxiandiao.com/20190510121600.png)