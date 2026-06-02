const VERSION = "1780422962964";
const BUILD_TIME = "02 Jun 2026, 17:56:02";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});