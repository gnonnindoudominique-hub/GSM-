var CACHE_NAME = 'gsm-clients-v12';
var FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png',
  './icon-192.png'
];

// 1. Installation
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activation : on supprime les anciennes versions v10, v11...
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. Quand on ouvre l'appli
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).then(function(response) {
      var responseClone = response.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(e.request, responseClone);
      });
      return response;
    }).catch(function() {
      return caches.match(e.request).then(function(r) {
        return r || caches.match('./index.html');
      });
    })
  );
});
