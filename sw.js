const CACHE = 'course-quiz-practice-v1';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll([
        './', './index.html', './manifest.webmanifest', './icon.svg',
        './通信原理/index.html', './电磁场电磁波/index.html', './数据通信与网络/index.html'
      ]))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const cp = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, cp));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
