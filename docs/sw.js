const VERSION = "1780484037396";
const BUILD_TIME = "03 Jun 2026, 10:53:57";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});