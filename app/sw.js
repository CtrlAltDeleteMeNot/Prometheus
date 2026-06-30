const VERSION = "1782818581411";
const BUILD_TIME = "30 Jun 2026, 11:23:01";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});