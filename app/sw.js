const VERSION = "1780486586281";
const BUILD_TIME = "03 Jun 2026, 11:36:26";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});