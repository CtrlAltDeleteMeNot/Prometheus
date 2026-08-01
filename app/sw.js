const VERSION = "1785576031679";
const BUILD_TIME = "01 Aug 2026, 09:20:31";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});