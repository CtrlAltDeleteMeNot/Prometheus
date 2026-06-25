const VERSION = "1782402462992";
const BUILD_TIME = "25 Jun 2026, 15:47:42";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});