const VERSION = "1782678977219";
const BUILD_TIME = "28 Jun 2026, 20:36:17";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});