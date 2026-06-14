const VERSION = "1781459785510";
const BUILD_TIME = "14 Jun 2026, 17:56:25";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});