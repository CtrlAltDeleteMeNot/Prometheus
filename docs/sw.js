const VERSION = "1782818582242";
const BUILD_TIME = "30 Jun 2026, 11:23:02";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});