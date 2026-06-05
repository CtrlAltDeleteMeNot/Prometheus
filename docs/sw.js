const VERSION = "1780665826053";
const BUILD_TIME = "05 Jun 2026, 13:23:46";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});