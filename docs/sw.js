const VERSION = "1780569157603";
const BUILD_TIME = "04 Jun 2026, 10:32:37";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});