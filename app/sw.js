const VERSION = "1780514794641";
const BUILD_TIME = "03 Jun 2026, 19:26:34";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});