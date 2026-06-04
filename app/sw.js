const VERSION = "1780561930428";
const BUILD_TIME = "04 Jun 2026, 08:32:10";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});