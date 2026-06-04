const VERSION = "1780583682648";
const BUILD_TIME = "04 Jun 2026, 14:34:42";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});