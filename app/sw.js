const VERSION = "1780597430438";
const BUILD_TIME = "04 Jun 2026, 18:23:50";
self.addEventListener('install', event => {
                    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});