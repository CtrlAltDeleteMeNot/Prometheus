const VERSION = "1780919556813";
const BUILD_TIME = "08 Jun 2026, 11:52:36";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});