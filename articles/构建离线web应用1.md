我喜欢移动app，而且也是那些坚持使用Web技术构建移动应用程序的人之一。

经过技术的不断迭代（可能还有一些其它的东西），移动体验设计愈来愈平易近人，给予用户更好的体验。

而今天，我们就要介绍一个新技术--渐进式 web 应用程序。在理解这个概念并自己尝试了一下之后，我觉得没有必要再做 hybrid 应用了。

我们准备做这样的一个demo：

![demo预览](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/articles/img/pwa-demo-1.png)

## Progressive Web Apps

渐进式 Web 应用是典型的旨在提高用户离线体验的 Web 应用。它解决了这样的问题：怎么才能不显示类似下面的离线错误？

![离线error](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/articles/img/pwa-demo-2.jpg)

事实上，PWA 不仅解决了离线错误，还在恢复连接的时候将用户与内容连接起来。移动设备是渐进式 web 应用的主要使用场景。让我来告诉你为什么？

### 桌面浏览器
- 用户打开电脑（在家、学校或者办公室）
- 检查是否连上网络，没有则手动连接
- 打开 web 应用

### 移动端浏览器
- 拿出手机
- 默认手机已经连接上网络
- 直接打开 app

如上，用户对待两种场景的处理方式是不一样的。移动端用户不一定有很好的网络连接，有的甚至没有。在这样的场景下，开发商需要做的就是保持用户对产品的好感，在其网络恢复时与其互动。如果信号很差，开发商需要通过一些手段保持用户的耐心，不至于在请求过程中用户直接关闭 web 应用。

当我们开始构建 PWA 应用时，你就能理解上面的场景了。

## Service Workers
PWA 背后的原理是 service workers。如果想让用户在离线场景下依然保持打开 web 页面，你需要在用户打开 web 应用并且有网络连接时做一些“后台任务”，这个“后台任务”会搜集 web 页面最近一次运行需要的一些资源，以备离线时使用。

这就好像每年秋收储备粮食，以备冬天不时之需一样，不断循环。

PWA 中的 service worker，可以类比成春天的播种的农民。下面是 MDN 对 service workers 的描述：
> Service worker 是一个注册在指定源和路径下的事件驱动 worker。它采用 JavaScript 控制关联的页面或者网站，拦截并修改访问和资源请求，细粒度地缓存资源。你可以完全控制应用在特定情形（最常见的情形是网络不可用）下的表现。

简而言之，service worker 就是一些在后台运行逻辑的 worker。它没有权限操作 DOM，但是可以调用其它的 API （例如 IndexDB 以及 Fetch API）。

开始之前请牢记：
- service workers 只能在 HTTPS 协议下生效（或者 Localhost）。
- service workers 被设计成异步的，不能使用 XHR （但你可以使用 Fetch）或者 LocalStorage。
- service workers 的作用范围是针对相对路径的。因此，`demo/sw.js` 只能相对于 `demo` 起作用，`demo/first/sw.js` 相对于 `first`。

## Mobile 还是 PWA
如果你能利用 service workers 存储离线使用所需的文件，那你就没有必要开发移动 app 了。如果你的 web 应用对移动用户进行了优化，并且几乎不需要调用移动端的硬件功能，那么你应该尝试一下 PWA。

我花了一些时间看飞行模式下一些移动 app 的表现。我将它们分成三类：

### 离线情况下不做任何操作

例子： Coinbase

![Coinbase](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/articles/img/pwa-coinbase.jpg)

Coinbase 就是一直停留在 loading 的这个页面。它甚至让我怀疑这样的 app 为啥要存在，因为这个页面简直跟 web 展示一模一样。Coinbase 不是财经类 app，无需实时展示信息，因此，PWA 可能只适用应用于其 App Shell。

> App Shell 是指不包含动态内容的一部分应用程序。例如导航菜单、侧边栏、背景、logo 等等。

### 离线情况下展示警告信息（未连接网络等等），展示 App Shell，但其它都不可用

例子：Uber

![Uber](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/articles/img/pwa-uber.jpg)

Uber 给用户展示了一些信息（通过 App Shell 以及地图），并且告知用户不能操作是由于他网络中断了。Uber是一个很高频的 app，这样的交互展示对于他们的应用场景很有意义。

### 离线情况下展示缓存的数据
例子： Medium

![Medium](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/articles/img/pwa-medium.jpg)

Medium在离线状态下展示缓存的数据，一些离线展示在这个分类里面的 app（例如，Instagram）还会提示用户离线了，所以，就不要对这个分类里面的 app 期望再搞了。

## 优化
我的想法是，如果 PWA（或者 service workers）技术成熟并且被大规模应用的话，为什么不节省掉：
1. 前往应用商店
2. 下载并不常用的 app
呢？

当我们接下来谈到 Web Manifest 时，你就意识到只要给你的 web 应用新增一个桌面 icon，web 应用就可以通过点击这个 icon 实现启动了。

一些公司已经在 PWA 方面做的比较好了，你可以在这个网址上面找到这些公司：[pwa.rocks](https://pwa.rocks/)

## 开发准备

我们已经介绍了足够多的理论知识了。这是一个手把手的教程，来吧，让我们动起手来。首先，按照下面的结构来创建一个新的项目：

```
|--pwa-demo
|----css
|----fonts
|----images
|----js
|----index.html
|----service-worker.js
```

下载 [Materialize](http://materializecss.com/) 这个 UI 库，用里面 `CSS`、`Fonts`、`js 文件`分别替换项目里面的文件夹。

打开 `index.html` 文件，引入一些资源：

```html
<!-- ./index.html -->
<!DOCTYPE html>
  <html>
    <head>
      <!--Import Google Icon Font-->
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!--Import materialize.css-->
      <link type="text/css" rel="stylesheet" href="css/materialize.min.css" media="screen,projection"/>
      <link type="text/css" rel="stylesheet" href="css/app.css">

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>

    <body>

      Body coming soon

      <!-- Scripts -->
      <script type="text/javascript" src="js/jquery-2.1.1.min.js"></script>
      <script type="text/javascript" src="js/materialize.min.js"></script>
      <script type="text/javascript" src="js/app.js"></script>
    </body>
  </html>
``` 

我们已经引入了下载好的文件，还需要自己在相应的目录创建一下 `app.css` 以及 `app.js` 这两个文件。