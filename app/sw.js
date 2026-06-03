const VERSION = "1780483141888";
const BUILD_TIME = "03 Jun 2026, 10:39:01";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});