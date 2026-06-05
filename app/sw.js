const VERSION = "1780652108321";
const BUILD_TIME = "05 Jun 2026, 09:35:08";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});