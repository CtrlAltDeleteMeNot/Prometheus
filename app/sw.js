const VERSION = "1780412246303";
const BUILD_TIME = "02 Jun 2026, 14:57:26";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});