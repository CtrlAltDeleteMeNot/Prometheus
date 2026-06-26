const VERSION = "1782504572377";
const BUILD_TIME = "26 Jun 2026, 20:09:32";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});