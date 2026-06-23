const VERSION = "1782250909260";
const BUILD_TIME = "23 Jun 2026, 21:41:49";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});