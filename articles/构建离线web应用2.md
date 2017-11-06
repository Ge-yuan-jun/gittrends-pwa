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