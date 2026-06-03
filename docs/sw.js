const VERSION = "1780514456037";
const BUILD_TIME = "03 Jun 2026, 19:20:56";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});