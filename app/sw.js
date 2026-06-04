const VERSION = "1780561056804";
const BUILD_TIME = "04 Jun 2026, 08:17:36";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});