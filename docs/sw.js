const VERSION = "1781297671088";
const BUILD_TIME = "12 Jun 2026, 20:54:31";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});