const VERSION = "1780408162300";
const BUILD_TIME = "02 Jun 2026, 13:49:22";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});