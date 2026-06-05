const VERSION = "1780667978356";
const BUILD_TIME = "05 Jun 2026, 13:59:38";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});