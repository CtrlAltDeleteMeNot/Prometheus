const VERSION = "1781195457100";
const BUILD_TIME = "11 Jun 2026, 16:30:57";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});