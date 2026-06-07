const VERSION = "1780840066620";
const BUILD_TIME = "07 Jun 2026, 13:47:46";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});