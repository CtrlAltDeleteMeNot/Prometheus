const VERSION = "1781458711256";
const BUILD_TIME = "14 Jun 2026, 17:38:31";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});