const VERSION = "1780837939566";
const BUILD_TIME = "07 Jun 2026, 13:12:19";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});