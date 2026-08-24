const VERSION = "1787582728161";
const BUILD_TIME = "24 Aug 2026, 14:45:28";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});