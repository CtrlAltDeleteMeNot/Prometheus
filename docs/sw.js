const VERSION = "1785613123149";
const BUILD_TIME = "01 Aug 2026, 19:38:43";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});