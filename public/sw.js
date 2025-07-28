// TeleKiosk Hospital Service Worker
const CACHE_NAME = 'telekiosk-v1.0.2-email-status-fix';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  // Add critical CSS and JS files
  // These will be automatically added by the build process
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Route patterns and their caching strategies
const ROUTE_CACHE_STRATEGIES = {
  // Static assets - network first during development to get updates
  '\\.(js|css)$': CACHE_STRATEGIES.NETWORK_FIRST,
  '\\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$': CACHE_STRATEGIES.CACHE_FIRST,
  
  // API routes - network first with fallback
  '^/api/': CACHE_STRATEGIES.NETWORK_FIRST,
  
  // Pages - stale while revalidate
  '^/$': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  '^/(booking|services|doctors|about|contact)': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  
  // Emergency routes - network only
  '^/emergency': CACHE_STRATEGIES.NETWORK_ONLY,
};

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Skip waiting and activate immediately');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with appropriate cache strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;
  
  const url = new URL(event.request.url);
  const strategy = getCacheStrategy(url.pathname);
  
  event.respondWith(handleRequest(event.request, strategy));
});

// Determine cache strategy for a given URL
function getCacheStrategy(pathname) {
  for (const [pattern, strategy] of Object.entries(ROUTE_CACHE_STRATEGIES)) {
    if (new RegExp(pattern).test(pathname)) {
      return strategy;
    }
  }
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE; // Default strategy
}

// Handle request with specified cache strategy
async function handleRequest(request, strategy) {
  const cache = await caches.open(CACHE_NAME);
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cache);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cache);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cache);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return networkOnly(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return cacheOnly(request, cache);
    
    default:
      return staleWhileRevalidate(request, cache);
  }
}

// Cache first strategy
async function cacheFirst(request, cache) {
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return getOfflineResponse(request);
  }
}

// Network first strategy
async function networkFirst(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return getOfflineResponse(request);
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request, cache) {
  const cachedResponse = await cache.match(request);
  
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Network update failed:', error);
    });
  
  if (cachedResponse) {
    networkPromise; // Update cache in background
    return cachedResponse;
  }
  
  try {
    return await networkPromise;
  } catch (error) {
    return getOfflineResponse(request);
  }
}

// Network only strategy
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return getOfflineResponse(request);
  }
}

// Cache only strategy
async function cacheOnly(request, cache) {
  const cachedResponse = await cache.match(request);
  return cachedResponse || getOfflineResponse(request);
}

// Get offline response
async function getOfflineResponse(request) {
  // For navigation requests, return offline page
  if (request.mode === 'navigate') {
    const cache = await caches.open(CACHE_NAME);
    const offlineResponse = await cache.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }
  }
  
  // For other requests, return a generic offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This content is not available offline'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Background sync for when connectivity is restored
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-appointments') {
    event.waitUntil(syncPendingAppointments());
  }
});

// Sync pending appointments when back online
async function syncPendingAppointments() {
  try {
    // Get pending appointments from IndexedDB
    const pendingAppointments = await getPendingAppointments();
    
    for (const appointment of pendingAppointments) {
      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointment)
        });
        
        if (response.ok) {
          await removePendingAppointment(appointment.id);
          console.log('[SW] Synced appointment:', appointment.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync appointment:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// IndexedDB helpers (simplified)
async function getPendingAppointments() {
  // Implementation would use IndexedDB to get pending appointments
  return [];
}

async function removePendingAppointment(id) {
  // Implementation would remove appointment from IndexedDB
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'You have a new message from TeleKiosk Hospital',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('TeleKiosk Hospital', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service worker loaded successfully');