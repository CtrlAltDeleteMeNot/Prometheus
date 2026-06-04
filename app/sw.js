const VERSION = "1780550225596";
const BUILD_TIME = "04 Jun 2026, 05:17:05";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});