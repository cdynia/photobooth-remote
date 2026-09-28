// CyberColt Booth Remote — service worker (installable PWA + offline shell).
// Network-first for the app shell so updates land immediately; falls back to the
// cache when offline. Firebase SDK + Firestore traffic are never cached (always
// network) so booth status is live.
const CACHE = 'ccpb-remote-v13';
const SHELL = ['./', './index.html', './jsQR.js', './favicon.svg', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;                 // never touch writes
  if (url.origin !== location.origin) return;             // Firebase/CDN → straight to network
  e.respondWith(
    fetch(e.request)
      .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then((m) => m || caches.match('./index.html')))
  );
});
