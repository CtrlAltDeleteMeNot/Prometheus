const VERSION = "1781033660936";
const BUILD_TIME = "09 Jun 2026, 19:34:20";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});