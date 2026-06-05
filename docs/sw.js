const VERSION = "1780667979681";
const BUILD_TIME = "05 Jun 2026, 13:59:39";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});