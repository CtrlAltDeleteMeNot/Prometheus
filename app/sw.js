const VERSION = "1781460447766";
const BUILD_TIME = "14 Jun 2026, 18:07:27";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});