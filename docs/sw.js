const VERSION = "1780667650176";
const BUILD_TIME = "05 Jun 2026, 13:54:10";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});