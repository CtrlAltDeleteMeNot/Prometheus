const VERSION = "1783899839819";
const BUILD_TIME = "12 Jul 2026, 23:43:59";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});