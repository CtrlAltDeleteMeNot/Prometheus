const VERSION = "1782922157175";
const BUILD_TIME = "01 Jul 2026, 16:09:17";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});