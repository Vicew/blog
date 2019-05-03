---
title: 为 Hexo 打造个性化 NexT 主题（初级篇）
date: 2019-05-02 22:45:39
tags: Hexo
categories: Hexo
---

在上一篇博客中最后我们安装了`Hexo`博客框架，但是就用默认主题生成的静态页面，不免会缺乏点创新性，这篇博客我们来讲讲如何让我们的博客个性化

**以下操作修改完都要执行`hexo g`重新生成=网页和替换网站根目录的操作**

## 配置文件

配置文件帮助我们预设置了一些基本的参数，条件。用来帮助我们的进程，应用程序，更或者操作系统运行的时候，可以在我们预先设定好的环境下运行。就像我们待会儿要用到的`Hexo`配置文件，就是根据配置文件来生成静态网页的

> 在`Hexo`中有两份主要的配置文件，其名称都是`_config.yml`。 其中，一份位于站点根目录下，主要包含`Hexo`本身的配置；另一份位于主题目录下，这份配置由主题作者提供，主要用于配置主题相关的选项

## 安装主题

> `Hexo`安装主题的方式非常简单，只需要将主题文件拷贝至站点目录的`themes`目录下， 然后修改下配置文件即可

```Linux
    cd 你的项目根目录下
    git clone https://github.com/iissnan/hexo-theme-next themes/next
```

**这里讲讲`git clone`的好处，当我们下载github上开源的文件时，免不了一些文件会出现更新的情况，所以我们可以通过`git pull`来快速更新，而不用重新下载文件来替换**

## 启用主题

这时候我们的主题还是默认主题，所以用vim编辑打开项目根目录配置文件，找到`theme`字段，并将其改为我们刚刚为新克隆的主题创建的目录名`next`

**如何在这么多字段中快速定位`theme`字段？输入反斜杠后面接你想要查找的关键词，回车即可，小写的 n 查找下一个，大写的 N 查找上一个**

![12]()

当你浏览器打开出现这个界面时，就说明你成功啦，当然你可以选择不同类型的外 Scheme ，这只是`NexT`默认的`Scheme-Muse`,目前`NexT`支持三种`Scheme`，他们是：

> - Muse - 默认 Scheme，这是 NexT 最初的版本，黑白主调，大量留白
> - Mist - Muse 的紧凑版本，整洁有序的单栏外观
> - Pisces - 双栏 Scheme，小家碧玉似的清新

![13]()

## 项目根目录基础配置 

1. 设置语言，选用简体中文

![14]()

其他语言的代码大家可以了解一下

|语言|代码|设定示例|
|:------|:------|:------|
|English|en|language: en|
|简体中文|zh-Hans|language: zh-Hans|
|Français|fr-FR|language: fr-FR|
|Português|pt|language: pt or language: pt-BR|
|繁體中文|zh-hk 或者 zh-tw|language: zh-hk|
|Русский язык|ru|language: ru|
|Deutsch|de|language: de|
|日本語|ja|language: ja|
|Indonesian|id|language: id|
|Korean|ko|language: ko|

2. 设置站点创立时间

新增字段`since`

```Linux
    since: 2017
```

3. 设置作者昵称

![15]()

4. 站点描述

站点描述可以是你喜欢的一句签名

![16]()

## 主题配置文件

1. 设置头像

在网上找到一个自己喜欢的头像，复制链接地址

![17]()

2. 设置侧栏

默认情况下，侧栏仅在文章页面（拥有目录列表）时才显示，并放置于右侧位置。根据自己喜欢设置

![18]()

设置侧栏显示的时机，修改`sidebars.display`的值，支持的选项有：

> - post - 默认行为，在文章页面（拥有目录列表）时显示
> - always - 在所有页面中都显示
> - hide - 在所有页面中都隐藏（可以手动展开）
> - remove - 完全移除

![19]()

3. 设置菜单

`Next`默认的菜单项有

|键值|设定值|显示文本（简体中文）|
|:------|:------|:------|
|home|home: /|主页|
|archives|archives: /archives|归档页|
|categories|categories: /categories|分类页|
|tag|tags: /tags|标签页|
|about|about: /about|关于页面|
|commonweal|commonweal: /404.html|公益 404|

其中除了主页和归档，其他页面都要我们手动去创建，我们以分类页为例

- 前往资源文件夹创建一个`categories`目录

```Linux
    hexo new page categories
```

**若你的站点运行在子目录中，请将链接前缀的`/`去掉**

- 编辑该目录下的`index.md`文件，将页面的类型设置为`categories`

![20]()

- 同时编辑主题配置文件`_config.yml`，添加`categories`到`menu`中就完成了，其他创建方法一样

![21]()

4. 侧边栏设置返回顶部，并且显示百分比

找到`sidebar`字段，设置`scrollpercent`的值为`true`

![22]()

5. 设置 阅读全文

找到`auto_excerpt`字段，设置`enable`的值为`true`

![23]()

可根据自己情况自由设置显示内容的长短`length`的大小