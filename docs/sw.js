const VERSION = "1780561058439";
const BUILD_TIME = "04 Jun 2026, 08:17:38";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});