const VERSION = "1782592673004";
const BUILD_TIME = "27 Jun 2026, 20:37:53";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});