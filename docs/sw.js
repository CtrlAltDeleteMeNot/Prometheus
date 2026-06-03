const VERSION = "1780514795963";
const BUILD_TIME = "03 Jun 2026, 19:26:35";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});