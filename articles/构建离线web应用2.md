关于本文：

![原文地址](https://scotch.io/tutorials/build-an-offline-git-trending-pwa-part-2-caching-and-offline)


译者：墨白
------
[构建离线 web 应用1](https://github.com/Ge-yuan-jun/gittrends-pwa/blob/master/articles/%E6%9E%84%E5%BB%BA%E7%A6%BB%E7%BA%BFweb%E5%BA%94%E7%94%A81.md)

------

上一篇文章中，我们成功尝试使用 service workers。我们也可以在应用中缓存一些资源。这篇文章我们准备了解这些：service workers 以及缓存是如何一起配合给用户一个完美的离线体验。

在前一个章节当我们学习如何 debugger 的时候，我们了解到浏览器的缓存存储。提及缓存时，不仅仅是指存储，还包括浏览器内用来保存数据以供离线使用的策略。