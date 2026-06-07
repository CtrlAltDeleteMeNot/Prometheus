const VERSION = "1780860879153";
const BUILD_TIME = "07 Jun 2026, 19:34:39";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});