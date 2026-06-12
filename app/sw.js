const VERSION = "1781298304878";
const BUILD_TIME = "12 Jun 2026, 21:05:04";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});