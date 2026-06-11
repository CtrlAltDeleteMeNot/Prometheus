const VERSION = "1781195456402";
const BUILD_TIME = "11 Jun 2026, 16:30:56";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});