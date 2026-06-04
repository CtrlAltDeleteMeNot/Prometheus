const VERSION = "1780569156163";
const BUILD_TIME = "04 Jun 2026, 10:32:36";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});