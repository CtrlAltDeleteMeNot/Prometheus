const VERSION = "1781292695598";
const BUILD_TIME = "12 Jun 2026, 19:31:35";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});