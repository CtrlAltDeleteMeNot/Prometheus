const VERSION = "1780581699725";
const BUILD_TIME = "04 Jun 2026, 14:01:39";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});