/* MUTANTE VIVA · Service Worker offline */
const CACHE = 'mutante-viva-v2';
const ASSETS = [
  './',
  './index.html',
  './MUTANTE_VIVA_AUTONOMA_v2.html',
  './sw.js',
  './manifest.webmanifest'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      if (res.ok && (req.url.includes(self.location.origin))) {
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
      }
      return res;
    }).catch(() => caches.match('./index.html') || caches.match('./MUTANTE_VIVA_AUTONOMA_v2.html')))
  );
});
// No true background mutation while browser killed — wall-clock catch-up on next open handles "disconnected life"
