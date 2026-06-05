const VERSION = "1780662220086";
const BUILD_TIME = "05 Jun 2026, 12:23:40";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});