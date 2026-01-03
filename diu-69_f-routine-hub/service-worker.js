const CACHE_NAME = "routinehub-cache-v1";
const urlsToCache = [
    "/index.html",
    "/style.css",
    "/app.js",
    "/icons/icon-192.png",
    "/icons/icon-512.png"
];

// Install and cache
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

// Activate and cleanup
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); }))
        )
    );
});

// Fetch network or cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
