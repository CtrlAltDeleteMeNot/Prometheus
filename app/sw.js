const VERSION = "1780860877820";
const BUILD_TIME = "07 Jun 2026, 19:34:37";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});