/* Service Worker: Offline-Cache fuer bruns-homepage */
const VERSION = 'eb-v64-2026-10-13';
const CORE = [
  '/',
  '/materialfinder/',
  '/geschichte/',
  '/geschichte/klasse-5/',
  '/geschichte/klasse-6/',
  '/geschichte/klasse-6/006/',
  '/geschichte/klasse-6/007/',
  '/geschichte/klasse-6/008/',
  '/geschichte/klasse-6/009/',
  '/geschichte/klasse-6/010/',
  '/geschichte/klasse-6/011/',
  '/geschichte/klasse-6/012/',
  '/geschichte/klasse-6/013/',
  '/geschichte/klasse-6/014/',
  '/geschichte/klasse-6/015/',
  '/geschichte/klasse-7/',
  '/geschichte/klasse-7/001/',
  '/geschichte/klasse-8/',
  '/geschichte/klasse-9/',
  '/geschichte/klasse-10/',
  '/mathe/',
  '/mathe/klasse-5/',
  '/mathe/klasse-6/',
  '/mathe/klasse-7/',
  '/mathe/klasse-8/',
  '/mathe/klasse-9/',
  '/mathe/klasse-10/',
  '/schulsozialarbeit/',
  '/schulsozialarbeit/soziales-lernen/',
  '/schulsozialarbeit/soziales-lernen/soziales-lernen-module.json',
  '/schulsozialarbeit/soziales-lernen/001/',
  '/schulsozialarbeit/soziales-lernen/001/assets/styles.css',
  '/schulsozialarbeit/soziales-lernen/001/assets/app.js',
  '/schulsozialarbeit/soziales-lernen/001/assets/gefuehle-kompass.svg',
  '/assets/site.css',
  '/assets/site.js',
  '/assets/search.js',
  '/assets/search-index.json',
  '/assets/ux.js',
  '/assets/materials.js',
  '/assets/featured.js',
  '/assets/geschichte-data.js',
  '/assets/geschichte-jahrgang.js',
  '/assets/geschichte-jahrgang.css',
  '/assets/mathe-data.js',
  '/assets/mathe-jahrgang.js',
  '/assets/mathe-jahrgang.css',
  '/assets/moor-feature.webp',
  '/manifest.webmanifest',
  '/offline.html'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy)).catch(()=>{});
      return res;
    }).catch(() => caches.match(req).then(hit => hit || caches.match('/offline.html'))));
    return;
  }
  // Geänderte Skripte, Styles und Suchdaten immer zuerst aus dem Netz laden.
  // Der Cache bleibt nur als Offline-Rückfall erhalten.
  if (req.destination === 'script' || req.destination === 'style' || url.pathname.endsWith('.json')) {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) caches.open(VERSION).then(c => c.put(req, res.clone())).catch(()=>{});
      return res;
    }).catch(() => caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const fresh = fetch(req).then(res => {
      if (res.ok) caches.open(VERSION).then(c => c.put(req, res.clone())).catch(()=>{});
      return res;
    }).catch(() => hit);
    return hit || fresh;
  }));
});
