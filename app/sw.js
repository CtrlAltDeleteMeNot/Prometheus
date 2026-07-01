const VERSION = "1782922156354";
const BUILD_TIME = "01 Jul 2026, 16:09:16";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});