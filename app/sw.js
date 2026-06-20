const VERSION = "1781944938292";
const BUILD_TIME = "20 Jun 2026, 08:42:18";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});