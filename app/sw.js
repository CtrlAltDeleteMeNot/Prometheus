const VERSION = "1780408814916";
const BUILD_TIME = "02 Jun 2026, 14:00:14";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});