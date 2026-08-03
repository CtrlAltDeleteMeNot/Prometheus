const VERSION = "1785777451362";
const BUILD_TIME = "03 Aug 2026, 17:17:31";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});