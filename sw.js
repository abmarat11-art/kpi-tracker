const CACHE = 'kpi-v2';

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    // Remove old caches
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => clients.claim())
    );
});

self.addEventListener('fetch', e => {
    // Network first: always try network, cache only as offline fallback
    e.respondWith(
        fetch(e.request)
            .then(response => {
                const clone = response.clone();
                caches.open(CACHE).then(c => c.put(e.request, clone));
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});
