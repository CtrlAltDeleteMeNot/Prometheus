const VERSION = "1785156591587";
const BUILD_TIME = "27 Jul 2026, 12:49:51";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});