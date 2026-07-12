const VERSION = "1783899840683";
const BUILD_TIME = "12 Jul 2026, 23:44:00";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});