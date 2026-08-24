const VERSION = "1787582727446";
const BUILD_TIME = "24 Aug 2026, 14:45:27";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});