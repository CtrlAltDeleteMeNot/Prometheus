const VERSION = "1780513624425";
const BUILD_TIME = "03 Jun 2026, 19:07:04";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});