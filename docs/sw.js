const VERSION = "1780512650604";
const BUILD_TIME = "03 Jun 2026, 18:50:50";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});