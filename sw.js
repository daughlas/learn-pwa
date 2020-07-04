// 不能 访问 DOM、window、localStorage 之类
const CACHE_NAME = 'cache-v2'

self.addEventListener("install", event => {
  console.log("install", event)
  event.waitUntil(caches.open(CACHE_NAME).then(cache => {
    cache.addAll([
      '/',
      './index.css'
    ])
  }))
})

self.addEventListener("activate", event => {
  console.log("activate", event)
  event.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cacheName => {
      if (cacheName !== CACHE_NAME) {
        return caches.delete(cacheName)
      }
    }))
  }));
})

self.addEventListener("fetch", event => {
  event.respondWith(caches.open(CACHE_NAME).then(cache => {
    console.log(cache)
    return cache.match(event.request).then(response => {
      if (response) {
        return response
      }
      return fetch(event.request).then(response => {
        cache.put(event.request, response.clone())
        return response
      })
    })
  }))
})