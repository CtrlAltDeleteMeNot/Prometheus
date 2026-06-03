const VERSION = "1780481787641";
const BUILD_TIME = "03 Jun 2026, 10:16:27";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});