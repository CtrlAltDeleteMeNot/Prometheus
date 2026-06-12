const VERSION = "1781305826559";
const BUILD_TIME = "12 Jun 2026, 23:10:26";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});