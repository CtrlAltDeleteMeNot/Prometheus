const VERSION = "1780420714886";
const BUILD_TIME = "02 Jun 2026, 17:18:34";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});