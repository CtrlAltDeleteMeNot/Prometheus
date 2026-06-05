const VERSION = "1780662425485";
const BUILD_TIME = "05 Jun 2026, 12:27:05";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});