const VERSION = "1780579936604";
const BUILD_TIME = "04 Jun 2026, 13:32:16";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});