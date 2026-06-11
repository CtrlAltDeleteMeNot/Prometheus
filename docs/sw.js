const VERSION = "1781207550308";
const BUILD_TIME = "11 Jun 2026, 19:52:30";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});