const VERSION = "1781307016636";
const BUILD_TIME = "12 Jun 2026, 23:30:16";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});