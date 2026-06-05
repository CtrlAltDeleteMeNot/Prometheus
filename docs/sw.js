const VERSION = "1780667157906";
const BUILD_TIME = "05 Jun 2026, 13:45:57";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});