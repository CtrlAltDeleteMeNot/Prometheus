const VERSION = "1782504573226";
const BUILD_TIME = "26 Jun 2026, 20:09:33";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});