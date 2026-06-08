const VERSION = "1780931860581";
const BUILD_TIME = "08 Jun 2026, 15:17:40";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});