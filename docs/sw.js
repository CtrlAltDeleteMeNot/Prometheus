const VERSION = "1780481804667";
const BUILD_TIME = "03 Jun 2026, 10:16:44";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});