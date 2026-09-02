const VERSION = "1788367548807";
const BUILD_TIME = "02 Sept 2026, 16:45:48";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});