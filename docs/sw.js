const VERSION = "1780561931871";
const BUILD_TIME = "04 Jun 2026, 08:32:11";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});