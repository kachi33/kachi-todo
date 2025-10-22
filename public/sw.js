const CACHE_NAME = 'kachi-todo-v1';
const STATIC_CACHE_NAME = 'kachi-todo-static-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /\/api\/todos/,
  /\/api\/lists/,
  /\/api\/stats/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static files - cache first strategy
    if (STATIC_FILES.some(file => url.pathname === file || url.pathname.includes('/static/'))) {
      event.respondWith(
        caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            return fetch(request)
              .then((response) => {
                if (response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(STATIC_CACHE_NAME)
                    .then((cache) => {
                      cache.put(request, responseClone);
                    });
                }
                return response;
              });
          })
      );
      return;
    }

    // API requests - network first, cache fallback
    if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Only cache successful GET responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Network failed, try cache
            return caches.match(request)
              .then((cachedResponse) => {
                if (cachedResponse) {
                  console.log('Serving from cache (offline):', request.url);
                  return cachedResponse;
                }

                // Return a custom offline response for API calls
                return new Response(
                  JSON.stringify({
                    error: 'Offline',
                    message: 'No network connection and no cached data available'
                  }),
                  {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }
                );
              });
          })
      );
      return;
    }

    // All other GET requests - network first
    event.respondWith(
      fetch(request)
        .catch(() => {
          // For navigation requests, return the cached index.html
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          // For other requests, return a generic offline response
          return new Response('Offline', { status: 503 });
        })
    );
  }

  // Non-GET requests (POST, PUT, DELETE) - always try network
  // These will be handled by the offline sync system
});

// Background sync event (if supported)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);

  if (event.tag === 'todo-sync') {
    event.waitUntil(
      // Trigger sync in the main app
      self.clients.matchAll()
        .then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'BACKGROUND_SYNC',
              tag: event.tag
            });
          });
        })
    );
  }
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  const { data } = event;

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME
    });
  }
});