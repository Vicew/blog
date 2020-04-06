---
title: node学习笔记
date: 2020-02-22 16:55:38
tags: server
categories: server
---

1. **正向代理**：比如我们要去访问谷歌网站，我们直接访问不通，那么我们就可以找一个代理服务器为我们服务，我们通过代理服务器请求到谷歌网站。对于谷歌而言他只知道有一个服务器访问了自己，并不知道这件事你是访问不了他,找了一个代理服务器访问自己。**反向代理**比如 我们访问百度网站，百度的代理服务器对外的域名为 https://www.baidu.com 。具体内部的服务器节点我们不知道。现实中我们通过访问百度的代理服务器后，代理服务器给我们转发请求到他们N多的服务器节点中的一个给我们进行搜索后将结果返回。
2. **Host $host**:Host的含义是表明请求的主机名，因为nginx作为反向代理使用，而如果后端真是的服务器设置有类似防盗链或者根据http请求头中的host字段来进行路由或判断功能的话，如果反向代理层的nginx不重写请求头中的host字段，将会导致请求失败【默认反向代理服务器会向后端真实服务器发送请求，并且请求头中的host字段应为proxy_pass指令设置的服务器】。
3. cookie -> session -> redis != mysql
4. crontab -e 编写定时器定时执行脚本
5. 天生的分析日志的工具（readline基于stream(流)）
6. **sql注入** 通过拼接sql语句 比如 select username, realname from users where username='zhangsan' and password='123'   但是当我们这样输入用户名时候 zhangsan' -- 后面的部门就是被注释掉了 无论输不输密码都是可以进入了.用escape解决（原理也是转译）
7. **xss攻击** 前端做转译左右尖括号转证&lt和&gt,mysql存储转译后的。
8. 数据库被攻破最不应该让黑客知道用户信息，md5的密码加密
9. http, nodejs处理http 处理路由 mysql
10. cookie session redis nginx 反向代理
11. 内存优化（网络IO 硬盘IO 文件IO通过流 ） 内存扩展（redis取代session）
12. express脚手架的设计是基于前后端不分离的
13. express 入口app.js的介绍：http-errors处理错误路由的库（404）。cookie-parser库对应我们之前写的解析cookie。morgon库对应我们之前写的日志功能。app为本次请求的实例。view engine setup视图引擎我们不管，前后端分离。express.json()类似于我们的getPostData方法,我们之前只对json只做了一种情况，express用urlencoded来实现更多的情况。父子路由通过router.get/post 对应我们之前的无数个if语句来处理路由。
14. express中间件的形式，第一个参数req,第二个参数res,第三个参数next,通过next的执行一个个的往下串联，当然不满足要求的不会执行。就是说app.get,app.post,app.use往里面注册的函数，我们把它叫做中间件。
15. express 中间件是异步回调， koa2原声支持async/await.新开发框架和系统，都开始基于koa2， 例如egg.js。express虽然未过时，但是koa2肯定是未来趋势。
16. 为何使用多进程：回顾之前讲session时候说过，操作系统限制一个进程的内存。内存：无法充分利用机器的全部内存。cpu:无法充分利用多核cpu的优势。
17. ![收到](http://blog.panxiandiao.com//20200301215043.png)