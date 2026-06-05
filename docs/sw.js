const VERSION = "1780662426816";
const BUILD_TIME = "05 Jun 2026, 12:27:06";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});