const VERSION = "1780514363001";
const BUILD_TIME = "03 Jun 2026, 19:19:23";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});