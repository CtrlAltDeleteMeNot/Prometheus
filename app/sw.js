const VERSION = "1781033659625";
const BUILD_TIME = "09 Jun 2026, 19:34:19";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});