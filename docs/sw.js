const VERSION = "1780485289273";
const BUILD_TIME = "03 Jun 2026, 11:14:49";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});