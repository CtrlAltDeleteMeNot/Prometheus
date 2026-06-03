const VERSION = "1780516202443";
const BUILD_TIME = "03 Jun 2026, 19:50:02";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});