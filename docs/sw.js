const VERSION = "1785576032498";
const BUILD_TIME = "01 Aug 2026, 09:20:32";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});