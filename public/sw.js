const CACHE_NAME = 'nasaq-pwa-cache-v3';
const STATIC_PREFIXES = ['/_next/', '/public/', '/manifest.json', '/favicon.ico', '/icons/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(['/', '/dashboard', '/manifest.json']))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isStatic = STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));

  if (isStatic) {
    event.respondWith(
      caches.match(request)
        .then((cached) => cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        }))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => {
        if (cached) return cached;

        if (request.headers.get('accept')?.includes('text/html')) {
          return new Response(
            `<!DOCTYPE html>
            <html lang="ar" dir="rtl">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>نسق - غير متصل</title>
                <style>
                  body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; background: #F8FAFC; color: #0f172a; }
                  h1 { color: #0B7D72; }
                </style>
              </head>
              <body>
                <h1>أنت غير متصل بالإنترنت</h1>
                <p>يرجى التحقق من اتصالك والمحاولة مرة أخرى.</p>
              </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }

        return new Response('', { status: 408, statusText: 'Request timed out.' });
      }))
  );
});
