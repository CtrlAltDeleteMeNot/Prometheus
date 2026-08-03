const VERSION = "1785777452164";
const BUILD_TIME = "03 Aug 2026, 17:17:32";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});