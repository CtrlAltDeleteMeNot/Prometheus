const VERSION = "1781292696272";
const BUILD_TIME = "12 Jun 2026, 19:31:36";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});