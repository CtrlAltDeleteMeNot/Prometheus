const VERSION = "1780583683964";
const BUILD_TIME = "04 Jun 2026, 14:34:43";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});