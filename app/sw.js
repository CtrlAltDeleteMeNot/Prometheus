const VERSION = "1785613122114";
const BUILD_TIME = "01 Aug 2026, 19:38:42";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});