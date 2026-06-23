const VERSION = "1782250910051";
const BUILD_TIME = "23 Jun 2026, 21:41:50";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});