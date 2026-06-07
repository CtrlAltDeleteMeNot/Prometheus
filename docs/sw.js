const VERSION = "1780840067935";
const BUILD_TIME = "07 Jun 2026, 13:47:47";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});