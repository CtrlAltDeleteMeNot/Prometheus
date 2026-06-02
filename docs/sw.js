const VERSION = "1780412259342";
const BUILD_TIME = "02 Jun 2026, 14:57:39";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});