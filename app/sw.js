const VERSION = "1780485247441";
const BUILD_TIME = "03 Jun 2026, 11:14:07";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});