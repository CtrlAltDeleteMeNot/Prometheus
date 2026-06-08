const VERSION = "1780931861942";
const BUILD_TIME = "08 Jun 2026, 15:17:41";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});