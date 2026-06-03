const VERSION = "1780512649268";
const BUILD_TIME = "03 Jun 2026, 18:50:49";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});