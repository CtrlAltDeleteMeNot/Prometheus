const VERSION = "1781304023210";
const BUILD_TIME = "12 Jun 2026, 22:40:23";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});