const VERSION = "1780550226921";
const BUILD_TIME = "04 Jun 2026, 05:17:06";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});