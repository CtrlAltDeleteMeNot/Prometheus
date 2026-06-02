const VERSION = "1780411243712";
const BUILD_TIME = "02 Jun 2026, 14:40:43";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});