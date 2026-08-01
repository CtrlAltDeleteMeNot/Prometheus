const VERSION = "1785613801717";
const BUILD_TIME = "01 Aug 2026, 19:50:01";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});