const VERSION = "1782502012274";
const BUILD_TIME = "26 Jun 2026, 19:26:52";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});