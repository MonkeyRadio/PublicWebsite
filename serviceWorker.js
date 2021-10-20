const CACHE_NAME = "V1";

const CONTENT_CACHE_FILES = ["assets/monkeyPNG.png", "assets/monkeyICO.ico",
"https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css",
"https://bootswatch.com/5/darkly/bootstrap.min.css",];

const OFFLINE_CACHE_FILES = ["assets/monkeyPNG.png", "offline.html","https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css", "https://bootswatch.com/5/darkly/bootstrap.min.css"];

const OFFLINE_PAGE = 'offline.html';

const CACHE_VERSIONS = {
  content: 'content-v' + CACHE_NAME,
  offline: 'offline-v' + CACHE_NAME,
};

self.addEventListener("install", event => {
  self.skipWaiting();
  console.log("Service Worker installing.");
  event.waitUntil(
    caches.open(CACHE_VERSIONS.offline).then((cache) => {return cache.addAll(OFFLINE_CACHE_FILES); }),
    caches.open(CACHE_VERSIONS.content).then((cache) => {return cache.addAll(CONTENT_CACHE_FILES); })
  );
});

self.addEventListener("fetch", event => {
  // Stratégie Cache-First
  event.respondWith(
    caches
      .match(event.request) // On vérifie si la requête a déjà été mise en cache
      .then(
        (response) => {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              // .then(
              //   (response) => {
              //
              //     if (response.status < 400) {
              //       if (~SUPPORTED_METHODS.indexOf(event.request.method) & amp; & amp; !isBlacklisted(event.request.url)) {
              //         cache.put(event.request, response.clone());
              //       }
              //       return response;
              //     } else {
              //       return caches.open(CACHE_VERSIONS.notFound).then((cache) => {
              //         return cache.match(NOT_FOUND_PAGE);
              //       })
              //     }
              //   }
              // )
              .then((response) => {
                if (response) {
                  return response;
                }
              })
              .catch(
                () => {

                  return caches.open(CACHE_VERSIONS.offline)
                    .then(
                      (offlineCache) => {
                        return offlineCache.match(OFFLINE_PAGE)
                      }
                    )

                }
              );
          }
        }
      )
  );
});
