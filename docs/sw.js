const VERSION = "1781944939399";
const BUILD_TIME = "20 Jun 2026, 08:42:19";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});