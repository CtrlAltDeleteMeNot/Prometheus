const VERSION = "1780420693563";
const BUILD_TIME = "02 Jun 2026, 17:18:13";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});