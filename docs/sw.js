const VERSION = "1780732745939";
const BUILD_TIME = "06 Jun 2026, 07:59:05";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});