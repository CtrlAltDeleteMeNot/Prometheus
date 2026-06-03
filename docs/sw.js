const VERSION = "1780514364304";
const BUILD_TIME = "03 Jun 2026, 19:19:24";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});