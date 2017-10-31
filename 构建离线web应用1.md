我喜欢移动app，而且也是那些坚持使用Web技术构建移动应用程序的人之一。

经过技术的不断迭代（可能还有一些其它的东西），移动体验设计愈来愈平易近人，给予用户更好的体验。

而今天，我们就要介绍一个新技术--渐进式 web 应用程序。在理解这个概念并自己尝试了一下之后，我觉得没有必要再做 hybrid 应用了。

我们准备做这样的一个demo：

![demo预览](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/pwa-demo-1.png)

## Progressive Web Apps

渐进式 Web 应用是典型的旨在提高用户离线体验的 Web 应用。它解决了这样的问题：怎么才能不显示类似下面的离线错误？

![离线error](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/pwa-demo-2.jpg)

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

![Coinbase](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/pwa-coinbase.jpg)

Coinbase 就是一直停留在 loading 的这个页面。它甚至让我怀疑这样的 app 为啥要存在，因为这个页面简直跟 web 展示一模一样。Coinbase 不是财经类 app，无需实时展示信息，因此，PWA 可能只适用应用于其 App Shell。

> App Shell 是指不包含动态内容的一部分应用程序。例如导航菜单、侧边栏、背景、logo 等等。

### 离线情况下展示警告信息（未连接网络等等），展示 App Shell，但其它都不可用

例子：Uber
![Uber](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/pwa-uber.jpg)

Uber 给用户展示了一些信息（通过 App Shell 以及地图），并且告知用户不能操作是由于他网络中断了。