const VERSION = "1787066148024";
const BUILD_TIME = "18 Aug 2026, 15:15:48";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});