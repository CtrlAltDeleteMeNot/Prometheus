const VERSION = "1780665824709";
const BUILD_TIME = "05 Jun 2026, 13:23:44";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});