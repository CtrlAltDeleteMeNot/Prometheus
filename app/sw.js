const VERSION = "1780735066057";
const BUILD_TIME = "06 Jun 2026, 08:37:46";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});