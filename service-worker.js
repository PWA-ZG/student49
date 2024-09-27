const CACHE_NAME = 'moja-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/styles.css',
    '/app.js',
    '/img/icon-192x192.png',
    '/img/icon-512x512.png'
];

// Instalacija Service Worker-a i keširanje resursa
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Catch fetch zahtjeva i vraćanje resursa iz cache-a
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                    // Cache hit - vraćanje resursa iz cache-a
                    if (response) {
                        return response;
                    }

                    // Ako resurs nije u cache-u, dohvati ga preko mreže
                    return fetch(event.request);
                }
            )
    );
});

self.addEventListener('sync', event => {
    if (event.tag === 'myFirstSync') {
        event.waitUntil(syncSnaps());
    }
});

let syncSnaps = async function () {
    entries().then((entries) => {
        entries.forEach((entry) => {
            let snap = entry[1];
            let formData = new FormData();
            formData.append("id", snap.id);
            formData.append("ts", snap.ts);
            formData.append("title", snap.title);
            formData.append("image", snap.image, snap.id + ".png");
            fetch("/saveSnap", {
                method: "POST",
                body: formData,
            })
                .then(function (res) {
                    if (res.ok) {
                        res.json().then(function (data) {
                            console.log("Deleting from idb:", data.id);
                            del(data.id);
                        });
                    } else {
                        console.log(res);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    });
};

