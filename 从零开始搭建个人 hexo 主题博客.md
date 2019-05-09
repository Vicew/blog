---
title: 从零开始搭建个人 hexo 主题博客
date: 2019-04-27 17:04:38
tags: Hexo
categories: Hexo
---

## 拥有一台属于自己的服务器和域名

自己的博客，当然要拥有一个自己的服务器和用来访问的域名啦，推荐全在阿里云官网购买即可

[点击进入阿里云官网](https://www.aliyun.com/)

**记得在阿里云进行学生认证，服务器需购买满三个月以上域名才能解析备案**

## 如何连接管理购买的服务器

服务器相当于一台裸机，也不在我们的电脑上，那我们就需要一个连接软件连接到我们购买的服务器。

>putty是ssh的一种连接方式，一般是连接linux服务器用的，先建立连接而后打开

[点击进入putty下载页面](https://en.softonic.com/download/putty/windows/post-download)

- 打开`putty`，在`Host Name`中输入服务器的`IP`地址，在`Saved Sessions`里面取一个这个`IP`的名字，点击`Save`，这样子在白色框内会出现`IP`名字，下次双击直接进入即可

![2](http://blog.panxiandiao.com/2.png)

- 输入登录名以及密码，登录名默认为`root`，注意密码的输入不会显示出来，输入完密码回车出现这样的页面说明连接成功啦

![3](http://blog.panxiandiao.com/3.png)

## 服务器常见工具以及软件的安装

### 安装git

>Git是一款免费、开源的分布式 版本控制系统 ，用于敏捷高效地处理任何或小或大的项目。

1. 在`Windows`下安装软件，我们只需要有`exe`文件，然后双击，下一步直接OK就可以了。但在`Linux`下,需要用到的是`apt-get`命令来安装软件

```Linux
    apt-get update // 更新
    apt-get install git
```

2. 这里你在使用`GitHub`之前需要添加`SSHkey`，用来验证`GitHub`远程仓库

> 配置步骤请参考[这里](https://segmentfault.com/a/1190000013759207)

### 安装Node

>Node.js 你可以理解为一种用JS去写后端程序的框架，语法和JS是一样的，所以它对前端工程师来说是友好的，前端工程师不需要再去掌握另一种比如PHP、Java这样的语法

1. [点击进入Node下载页面](https://nodejs.org/en/download/)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;右击复制链接

![4](http://blog.panxiandiao.com/4.png)

```Linux
    cd ~ // 返回home目录
    wget 复制的地址 // wget命令用于从网络上下载资源，没有指定目录，下载资源回默认为当前目录
```

2. 解压并移动到用户用来保存安装或者手动编译的程序`/usr/local`目录中，最后删除安装包

```Linux
    xz -d node-v8.12.0-linux-x64.tar.xz  // 下载的文件后缀名为xz是使用tar打包后再压缩生成的，使用xz工具命令解压，-d表示解压缩后压缩包消失
    tar -xvf node-v8.12.0-linux-x64.tar // 解压包
    mv node-v8.12.0-linux-x64 /usr/local/node // node-v8.12.0-linux-x64移到/usr/local目录下并且重命名为node
    rm -f node-v8.12.0-linux-x64.tar // 删除包
```

3. 执行下面代码显示版本信息即代表安装完成

```Linux
    /usr/local/node/bin/node -v
```

**这里可能会有人会提问肯定在其他目录下会用到`node`的呀，又不是只有在`node`所在的文件夹才会用到。那么这里我们要为`node`设置环境变量，通俗的来讲，如果你在其他目录输入有关`node`的命令行，当前目录下识别不了这行命令，那么就会前往到你设置的环境变量中寻找**

4. 用软连接为`node npm`设置环境变量，放到`usr/local/bin`下

```Linux
    ln -s /usr/local/node/bin/node /usr/local/bin
    ln -s /usr/local/node/bin/npm  /usr/local/bin
```

为什么上面用`apt-get`安装的软件安装的都默认在环境变量里了，所以不需要设置软连接

`npm`是随同`Node`一起安装的包管理工具，能解决`NodeJS`代码部署上的很多问题，常见的使用场景有以下几种：

- 允许用户从NPM服务器下载别人编写的第三方包到本地使用

- 允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用

- 允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用

### 安装Nginx

在之前学校的学习中用过`vs2016`进行`web`开发，`F5`启动，右下角会出现一个`IIS`来跑你的`web`站点，显示出网页。那么在`Linux`环境下，我们选择`Nginx`

>Nginx是一款轻量级的 Web 服务器/反向代理服务器及电子邮件（IMAP/POP3）代理服务器，在 BSD-like 协议下发行。其特点是占有内存少，并发能力强，事实上nginx的并发能力确实在同类型的网页服务器中表现较好，中国大陆使用nginx网站用户有：百度、京东、新浪、网易、腾讯、淘宝等

```Linux
    apt-get install nginx
```

## 服务器安全组的配置

**有人会问安装完了`Nginx`在浏览器输入域名或者`IP`为什么还是显示找不到网页，这里服务器又涉及到安全组的配置**

服务器安全组是一种类似于防火墙的东西，它可以在一定程度上保护你服务器的安全性，安全组可以控制80端口，22端口，21端口，3389端口是否能直接被访问，要想浏览器访问到你的服务器，需要服务器开放80端口，具体操作如下：

1. 打开阿里云控制台，点击安全组配置

![1](http://blog.panxiandiao.com/1.png)

2. 点击配置规则之后你会发现80端口没有配置，点击右上角添加安全组规则

![5](http://blog.panxiandiao.com/5.png)

当你看到`Nginx`欢迎页面的时候，就说明你成功啦

![6](http://blog.panxiandiao.com/6.png)

3. 这里就有一个问题了，我们看到的这个页面上的`html,css`内容是存放在哪里呢，我们去找找到`sites-enabled`目录（只有在`sites-enabled`目录下的配置文件才能够真正被用户访问），打开这个文件夹，你会发现一个名为`default`的文件

![7](http://blog.panxiandiao.com/7.png)

- 用`vim`编辑查看`default`的内容我们可以发现网站的根目录

![8](http://blog.panxiandiao.com/8.png)

- 那我们就顺藤摸瓜进入网站根目录瞅瞅

![9](http://blog.panxiandiao.com/9.png)

- 这就是`Nginx`整个欢迎页面的内容文件

## 安装Hexo

1. 做了这么多的前提工作，终于可以着手有关博客的内容了

> Hexo是一个快速、简洁且高效的博客框架。Hexo使用Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

```Linux
    npm install -g hexo-cli // 全局安装hexo-cli,hexo的功能封装成命令供我们用户调用就是hexo-cli
```

2. 同样为`hexo`设置软连接

```Linux
    ln -s /usr/local/node/bin/hexo /usr/local/bin
```

3. 新建`hexo`博客项目

```Linux
    cd ~
    sudo hexo init myhexo // 以管理员身份新建项目
    cd myhexo
    hexo g // 生成网站静态文件到默认设置的 public 文件夹
    rm -rf /var/www/html/
    cp -r ~/myhexo/public/ /var/www/html // 替换网站根目录（那个欢迎界面就被替换掉啦）
```

![10](http://blog.panxiandiao.com/10.png)

看到这个就说明博客部署成功！！！

## 配置Git仓库
 
1. 在`github`中添加仓库

![11](http://blog.panxiandiao.com/11.png)

打钩代表在仓库生成一个`markdown`文件，用来描述你的仓库

2. 服务器配置`Git`仓库

```Linux
    cd ~/myhexo/source // 进入资源文件夹，这个文件夹用来存放内容
    rm -rf _posts // _posts就是存放你博客的文件夹
    git clone git@github.com:你的github名字/blog.git _posts
    cd ~/myhexo
    hexo g
    rm -rf /var/www/html/
    cp -r ~/myhexo/public/ /var/www/html
```

这时候你会发现今天你的`github`有了`contribution`，代表你的项目创建成功啦

