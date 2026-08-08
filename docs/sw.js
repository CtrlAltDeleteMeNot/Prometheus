const VERSION = "1786220086005";
const BUILD_TIME = "08 Aug 2026, 20:14:46";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});