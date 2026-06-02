const VERSION = "1780408078081";
const BUILD_TIME = "02 Jun 2026, 13:47:58";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});