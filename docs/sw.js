const VERSION = "1780735067434";
const BUILD_TIME = "06 Jun 2026, 08:37:47";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});