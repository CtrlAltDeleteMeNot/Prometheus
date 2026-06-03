const VERSION = "1780486576161";
const BUILD_TIME = "03 Jun 2026, 11:36:16";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});