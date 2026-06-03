const VERSION = "1780513625732";
const BUILD_TIME = "03 Jun 2026, 19:07:05";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});