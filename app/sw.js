const VERSION = "1781307937226";
const BUILD_TIME = "12 Jun 2026, 23:45:37";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});