const VERSION = "1780516203764";
const BUILD_TIME = "03 Jun 2026, 19:50:03";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});