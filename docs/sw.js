const VERSION = "1781298305605";
const BUILD_TIME = "12 Jun 2026, 21:05:05";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});