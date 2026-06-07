const VERSION = "1780837938206";
const BUILD_TIME = "07 Jun 2026, 13:12:18";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});