const VERSION = "1782678976358";
const BUILD_TIME = "28 Jun 2026, 20:36:16";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});