const VERSION = "1780840353604";
const BUILD_TIME = "07 Jun 2026, 13:52:33";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});