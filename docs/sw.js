const VERSION = "1780422957543";
const BUILD_TIME = "02 Jun 2026, 17:55:57";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});