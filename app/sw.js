const VERSION = "1781305825874";
const BUILD_TIME = "12 Jun 2026, 23:10:25";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});