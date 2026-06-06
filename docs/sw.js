const VERSION = "1780735989233";
const BUILD_TIME = "06 Jun 2026, 08:53:09";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});