const VERSION = "1780667648858";
const BUILD_TIME = "05 Jun 2026, 13:54:08";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});