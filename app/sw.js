const VERSION = "1781034367036";
const BUILD_TIME = "09 Jun 2026, 19:46:07";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});