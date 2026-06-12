const VERSION = "1781305575513";
const BUILD_TIME = "12 Jun 2026, 23:06:15";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});