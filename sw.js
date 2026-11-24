var CACHE_NAME = 'gsm-clients-v20';
var FILES_TO_CACHE = ['./','./index.html','./manifest.json','./icon-512.png','./icon-192.png'];
self.addEventListener('install', function(e){e.waitUntil(caches.open(CACHE_NAME).then(function(cache){return cache.addAll(FILES_TO_CACHE);}));self.skipWaiting();});
self.addEventListener('activate', function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.map(function(key){if(key!==CACHE_NAME)return caches.delete(key);}));}));self.clients.claim();});
self.addEventListener('fetch', function(e){e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(CACHE_NAME).then(function(cache){cache.put(e.request,c);});return r;}).catch(function(){return caches.match(e.request).then(function(x){return x||caches.match('./index.html');});}));});
