const VERSION = "1781307015948";
const BUILD_TIME = "12 Jun 2026, 23:30:15";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});