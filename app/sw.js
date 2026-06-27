const VERSION = "1782592238729";
const BUILD_TIME = "27 Jun 2026, 20:30:38";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});