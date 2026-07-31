const VERSION = "1785529776890";
const BUILD_TIME = "31 Jul 2026, 20:29:36";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});