const VERSION = "1785156590756";
const BUILD_TIME = "27 Jul 2026, 12:49:50";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});