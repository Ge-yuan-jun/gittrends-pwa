关于本文：

[原文地址](https://scotch.io/tutorials/build-an-offline-git-trending-pwa-part-2-caching-and-offline)


译者：墨白
------
[构建离线 web 应用1](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/articles/%E6%9E%84%E5%BB%BA%E7%A6%BB%E7%BA%BFweb%E5%BA%94%E7%94%A81.md)

------

上一篇文章中，我们成功尝试使用 service workers。我们也可以在应用中缓存一些资源。这篇文章我们准备了解这些：service workers 以及缓存是如何一起配合给用户一个完美的离线体验。

在前一个章节当我们学习如何 debugger 的时候，我们了解到浏览器的缓存存储。提及缓存时，不仅仅是指存储，还包括浏览器内用来保存数据以供离线使用的策略。

在这篇文章中，我们将要：
- 了解社区中常见的缓存策略
- 尝试可用的缓存 api
- 做一个用来展示 Github trending project 的 demo
- 在 demo 中演示离线状态下利用缓存所带来的体验

## 缓存策略

软件工程中的每一个理论都是对同一类问题解决方案的总结，每一个都需要时间整理并被大众接受，成为推荐的解决方案。对于 PWA 的缓存策略来说同样如此。[Jake Archibald](https://jakearchibald.com/) 汇总了很多常用的方案，但我们只打算介绍其中一些常用的：

### Install 期间缓存

这个方案我们在上一篇文章中介绍过，缓存 app shell 展示时需要的所有资源：

```js
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
```

缓存的资源包括 HTML 模板，CSS 文件，JavaScript，fonts，少量的图片。

### 缓存请求返回的数据

这个方案是指如果之前的网络请求数据被缓存了，那么就用缓存的数据更新页面。如果缓存不可用，那直接去网络请求数据。当请求成功返回时，利用返回的数据更新页面并缓存返回的数据。

```js
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
```

这种方案主要应用用户频繁手动更新内容的场景，比如用户的收件箱或者文章内容。

### 先展示缓存，再根据请求的数据更新页面

这种方案将同时请求缓存以及服务端的数据。如果某一项在缓存中有对应的数据，好，直接在页面中展示。当网络请求的数据返回时，利用返回的数据更新页面：

```js
let networkReturned = false;
if ('caches' in window) {
  caches.match(app.apiURL).then(function(response) {
    if (response) {
      response.json().then(function(trends) {
        console.log('From cache...')
        if(!networkReturned) {
          app.updateTrends(trends);
        }
      });
    }
  });
}

fetch(app.apiURL)
.then(response => response.json())
.then(function(trends) {
  console.log('From server...')
  networkReturned = true;
  app.updateTrends(trends.items)
}).catch(function(err) {
  // Error
});
```

在大多数情况下，网络请求返回的数据会将从缓存中取出的数据覆盖。但在网页中，什么情况都有可能发生，有时候网络请求数据比从缓存中取数据要快。因此，我们需要设置一个 flag 来判断网络请求有没有返回，这就是上例中的 networkReturned。

## 缓存部分技术选型

目前有两种可持续性数据存储方案 -- Cache Storage 以及 Index DB（IDB）。

- **Cache Storage**：在过去的一段时间里，我们依赖 AppCache 来进行缓存处理，但我们需要一个可操作性更强的 API。幸运的是，浏览器提供了 Cache 这样的一个 API，给 Service Worker 的缓存操作带来了更多的可能。并且，这个 API 同时支持 service workers 以及 web 页面。在前一篇文章中，我们已经使用过了这个 API。
- **Index DB**：Index DB 是一个异步数据存储方案。对于这个 API 是又爱又恨，还好，像localForage这样的类库使用类似localStorage的操作方式简化了API。

Service Worker 对于这两种存储方案都提供支持。那么问题来了，什么场景下选择哪一种技术方案呢？[ Addy Osmani 的博客](https://medium.com/dev-channel/offline-storage-for-progressive-web-apps-70d52695513c)已经总结好了。

> 对于利用 URL 可直接查看的资源，使用支持 Service Worker 的 Cache Storage。其它类型的资源，使用利用 Promise 包裹之后的 IndexedDB。

## SW Precache

上文已经介绍了缓存策略以及数据缓存数据。在实战之前，还想给大家介绍一下谷歌的 [SW Precache](https://github.com/GoogleChromeLabs/sw-precache)。

这个工具还有一个额外的功能：将我们之前讨论的缓存文件设置利用正则简化成一个配置对象。所有你需要做的就是在一个数组中定义缓存的项目。

让我们来尝试使用一下 precache，让其自动生成 `service-worker.js`。首先，我们需要在项目的根目录下新增一个 `package.json` 文件：

```js
npm init -y
```

安装 sw-precache：

```js
npm install --save-dev sw-precache
```

创建一个配置文件：
```js
// ./tools/precache.js

const name = 'scotchPWA-v1'
module.exports = {
  staticFileGlobs: [
    './index.html',
    './images/*.{png,svg,gif,jpg}',
    './fonts/**/*.{woff,woff2}',
    './js/*.js',
    './css/*.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
  ],
  stripPrefix: '.'
};
```

`staticFileGlobs` 里面利用正则匹配我们想要缓存的文件。只需要利用正则，比之前枚举所有的文件简单很多。

在 `package.json` 中新增一个 script 用来生成 service worker 文件：

```js
"scripts": {
  "sw": "sw-precache --config=tools/precache.js --verbose"
},
```

运行下面的命令即可生成 service worker 文件：

```js
npm run sw
```

查看生成的文件，是不是很熟悉？

## 完成 demo

在做 web 应用离线功能之前，让我们先来完成应用的基本功能。

回到 `app.js` 文件，我们要在页面加载完成时去获取当前 Github 流行的项目（项目以 star 数的多少来排序）：

```js
(function() {
  const app = {
    apiURL: `https://api.github.com/search/repositories?q=created:%22${dates.startDate()}+..+${dates.endDate()}%22%20language:javascript&sort=stars&order=desc`
  }

  app.getTrends = function() {
    fetch(app.apiURL)
    .then(response => response.json())
    .then(function(trends) {
      console.log('From server...')
      app.updateTrends(trends.items)
    }).catch(function(err) {
      // Error
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    app.getTrends()
  })

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('/service-worker.js')
     .then(function() { 
        console.log('Service Worker Registered'); 
      });
  }
})()
```

注意 API URL 字符串中的日期。我们是这样构造的：

```js
Date.prototype.yyyymmdd = function() {
  // getMonth is zero based,
  // so we increment by 1
  let mm = this.getMonth() + 1;
  let dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
        ].join('-');
};

const dates = {
  startDate: function() {
     const startDate = new Date();
     startDate.setDate(startDate.getDate() - 7);
     return startDate.yyyymmdd();
   },
   endDate: function() {
     const endDate = new Date();
     return endDate.yyyymmdd();
   }
 }
```

`yyyymmdd` 帮我们将日期构造成 Github API 所规定的格式（`yyyy-mm-dd`）。

当 `getTrends` 获取数据之后，调用了 `updateTrends` 方法，传入获取到的数据。让我们看看这个方法做了些什么：

```js
app.updateTrends = function(trends) {
 const trendsRow = document.querySelector('.trends');
  for(let i = 0; i < trends.length; i++) {
    const trend = trends[i];
    trendsRow.appendChild(app.createCard(trend));
  }
}
```

遍历请求返回的数据，利用 `createCard` 来创建 DOM 模板，然后，将这段 DOM 插入 `.trends` 元素： 

```html
<!-- ./index.html -->

<div class="row trends">
 <!-- append here -->
</div>
```

`createCard` 利用下面的代码来创建模板：

```js
const app = {
  apiURL: `...`,
  cardTemplate: document.querySelector('.card-template')
}

app.createCard = function(trend) {
  const card = app.cardTemplate.cloneNode(true);
  card.classList.remove('card-template')
  card.querySelector('.card-title').textContent = trend.full_name
  card.querySelector('.card-lang').textContent = trend.language
  card.querySelector('.card-stars').textContent = trend.stargazers_count
  card.querySelector('.card-forks').textContent = trend.forks
  card.querySelector('.card-link').setAttribute('href', trend.html_url)
  card.querySelector('.card-link').setAttribute('target', '_blank')
  return card;
}
```

下面就是所创建的 DOM 结构：

```HTML
<div class="row trends">
  <divclass="col s12 m4 card-template">
    <div class="card horizontal">
      <div class="card-stacked">
        <div class="card-content white-text">
          <span class="card-title">Card Title</span>
          <div class="card-sub grey-text text-lighten-2">
            <i class="material-icons">info</i><span class="card-lang"> JavaScript</span>
            <i class="material-icons">star</i><span class="card-stars"> 299</span>
            <i class="material-icons">assessment</i><span class="card-forks"> 100</span>
          </div>
          <p>A set of best practices for JavaScript projects</p>
        </div>
        <div class="card-action">
          <a href="#" class="card-link">Visit Repo</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

![trending](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/articles/img/pwa-card.jpg)

## 运行时缓存的内容

在应用程序运行时，需要缓存从服务端获取的动态内容。不再是 app shell 了，而是用户真正浏览的内容。

我们需要提前配置告诉 service worker ，在运行时需要缓存的文件：

```js
// ./tools/precache.js
const name = 'scotchPWA-v1'
module.exports = {
  staticFileGlobs: [
    // ...
  ],
  stripPrefix: '.',
  // Run time cache
  runtimeCaching: [{
    urlPattern: /https:\/\/api\.github\.com\/search\/repositories/,
    handler: 'networkFirst',
    options: {
      cache: {
        name: name
      }
    }
  }]
};
```

我们定义了一个 url 正则匹配符，匹配成功时，读取缓存。这个正则匹配所有的 Github 搜索 API。我们打算应用“Cache, Then network.”的策略。

这样，我们先展示缓存的内容，当有网络连接时候，更新内容：

```js
app.getTrends = function() {
 const networkReturned = false;
  if ('caches' in window) {
    caches.match(app.apiURL).then(function(response) {
      if (response) {
        response.json().then(function(trends) {
          console.log('From cache...')
          if(!networkReturned) {
            app.updateTrends(trends);
          }
        });
      }
    });
  }

  fetch(app.apiURL)
  .then(response => response.json())
  .then(function(trends) {
    console.log('From server...')
    app.updateTrends(trends.items)
    networkReturned = true;
  }).catch(function(err) {
    // Error
  });
}
```

在 `precache.js` 中更新缓存的版本，重新生成 service worker:

```js
const name = 'scotchPWA-v2'
```

```bash
npm run sw
```

当你运行应用的时候，尝试刷新，打开控制台，勾选 offline 选项。之后，刷新，以及见证奇迹的时刻：

![trending](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/articles/img/pwa-refresh.jpg)