const VERSION = "1780581701143";
const BUILD_TIME = "04 Jun 2026, 14:01:41";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});