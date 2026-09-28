const CACHE_NAME = "mi-primera-app-v4";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];


self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache =>
        cache.addAll(ARCHIVOS)
      )

  );

  self.skipWaiting();

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>

      Promise.all(

        keys
          .filter(
            key =>
              key !== CACHE_NAME
          )
          .map(
            key =>
              caches.delete(key)
          )

      )

    )

  );

  self.clients.claim();

});


self.addEventListener("fetch", event => {

  /*
    Las llamadas a Apps Script
    NO deben guardarse en caché.
  */

  if (
    event.request.url.includes(
      "script.google.com"
    ) ||
    event.request.url.includes(
      "script.googleusercontent.com"
    )
  ) {

    return;

  }


  event.respondWith(

    fetch(event.request)

      .then(respuesta => {

        const copia =
          respuesta.clone();


        caches.open(CACHE_NAME)
          .then(cache => {

            cache.put(
              event.request,
              copia
            );

          });


        return respuesta;

      })

      .catch(() =>

        caches.match(
          event.request
        )

      )

  );

});
