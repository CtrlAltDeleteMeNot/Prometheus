const VERSION = "1780732744619";
const BUILD_TIME = "06 Jun 2026, 07:59:04";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});