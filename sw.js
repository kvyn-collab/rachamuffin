/**
 * 🔧 Service Worker para Rachamuffin PWA
 * Proporciona funcionalidad offline y caching inteligente
 */

const CACHE_NAME = 'rachamuffin-v2.0.0';
const STATIC_CACHE = 'rachamuffin-static-v2';
const DYNAMIC_CACHE = 'rachamuffin-dynamic-v2';
const API_CACHE = 'rachamuffin-api-v2';

// Recursos que se cachean inmediatamente
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/index_modern.html',
    '/js/app.js',
    '/js/utils/utils.js',
    '/js/components/NotificationSystem.js',
    '/js/components/AvatarSystem.js',
    '/js/components/GamificationSystem.js',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucky',
    '/manifest.json'
];

// APIs que pueden funcionar offline
const OFFLINE_APIS = [
    'https://api.dicebear.com/'
];

/**
 * Instalación del Service Worker
 */
self.addEventListener('install', event => {
    console.log('🔧 Service Worker instalándose...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Cacheando recursos estáticos...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                // Forzar activación inmediata
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Error cacheando recursos:', error);
            })
    );
});

/**
 * Activación del Service Worker
 */
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker activándose...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Eliminar caches antiguos
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== API_CACHE &&
                            cacheName.startsWith('rachamuffin')) {
                            console.log('🗑️ Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // Tomar control de todas las pestañas
                return self.clients.claim();
            })
    );
});

/**
 * Intercepción de requests (estrategia de caching)
 */
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Solo manejar requests HTTP/HTTPS
    if (!request.url.startsWith('http')) {
        return;
    }

    // Estrategia diferente según el tipo de recurso
    if (isStaticAsset(request)) {
        // Cache First para recursos estáticos
        event.respondWith(cacheFirstStrategy(request));
    } else if (isAPIRequest(request)) {
        // Network First para APIs (con fallback offline)
        event.respondWith(networkFirstStrategy(request));
    } else if (isNavigationRequest(request)) {
        // Network First para navegación (con fallback offline)
        event.respondWith(navigationStrategy(request));
    } else {
        // Stale While Revalidate para otros recursos
        event.respondWith(staleWhileRevalidateStrategy(request));
    }
});

/**
 * Estrategias de caching
 */

// Cache First: Busca en cache primero, luego en red
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        // Cachear respuesta exitosa
        if (networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache First error:', error);
        throw error;
    }
}

// Network First: Busca en red primero, luego en cache
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cachear respuesta exitosa
        if (networkResponse.status === 200) {
            const cache = await caches.open(API_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', request.url);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback offline para APIs
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'Esta función no está disponible sin conexión',
                offline: true
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Navigation Strategy: Para páginas HTML
async function navigationStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        console.log('Navigation offline, serving cached version');
        
        const cachedResponse = await caches.match('/index_modern.html');
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback mínimo
        return new Response(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Rachamuffin - Offline</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 2rem;
                        background: linear-gradient(45deg, #ff4757, #ffa502);
                        color: white;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .offline-container {
                        background: rgba(0,0,0,0.7);
                        padding: 2rem;
                        border-radius: 15px;
                        max-width: 400px;
                        margin: 0 auto;
                    }
                </style>
            </head>
            <body>
                <div class="offline-container">
                    <h1>🦸 Rachamuffin</h1>
                    <h2>Modo Offline</h2>
                    <p>No tienes conexión a internet, pero puedes seguir usando algunas funciones básicas.</p>
                    <button onclick="window.location.reload()" style="
                        background: #ffa502;
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 25px;
                        font-weight: bold;
                        cursor: pointer;
                        margin-top: 1rem;
                    ">Reintentar</button>
                </div>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

// Stale While Revalidate: Usa cache inmediatamente, actualiza en segundo plano
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse || fetchPromise;
}

/**
 * Utilidades para detectar tipos de requests
 */
function isStaticAsset(request) {
    const url = new URL(request.url);
    const pathname = url.pathname.toLowerCase();
    
    return (
        pathname.endsWith('.js') ||
        pathname.endsWith('.css') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.jpeg') ||
        pathname.endsWith('.gif') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.ico') ||
        pathname.endsWith('.woff') ||
        pathname.endsWith('.woff2') ||
        url.hostname === 'fonts.googleapis.com' ||
        url.hostname === 'fonts.gstatic.com'
    );
}

function isAPIRequest(request) {
    const url = new URL(request.url);
    return (
        url.hostname === 'api.dicebear.com' ||
        OFFLINE_APIS.some(api => request.url.startsWith(api))
    );
}

function isNavigationRequest(request) {
    return request.mode === 'navigate' || 
           (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

/**
 * Manejo de mensajes del cliente
 */
self.addEventListener('message', event => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'GET_CACHE_SIZE':
            getCacheSize().then(size => {
                event.ports[0].postMessage({ size });
            });
            break;
    }
});

/**
 * Funciones de utilidad
 */
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter(name => name.startsWith('rachamuffin'))
            .map(name => caches.delete(name))
    );
}

async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
        if (cacheName.startsWith('rachamuffin')) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
        }
    }
    
    return totalSize;
}

/**
 * Sincronización en segundo plano
 */
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sincronizar datos pendientes cuando vuelva la conexión
        const pendingData = await getStoredPendingData();
        
        for (const data of pendingData) {
            await syncData(data);
        }
        
        // Limpiar datos sincronizados
        await clearPendingData();
        
        console.log('✅ Sincronización en segundo plano completada');
    } catch (error) {
        console.error('❌ Error en sincronización:', error);
    }
}

/**
 * Utilidades de almacenamiento para datos pendientes
 */
async function getStoredPendingData() {
    // Esta función debería acceder a IndexedDB o similar
    // Por ahora, retorno un array vacío
    return [];
}

async function clearPendingData() {
    // Limpiar datos sincronizados
    console.log('Limpiando datos sincronizados');
}

async function syncData(data) {
    // Implementar lógica de sincronización específica
    console.log('Sincronizando datos:', data);
}

/**
 * Notificaciones push (preparado para futuras versiones)
 */
self.addEventListener('push', event => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'rachamuffin-notification',
        renotify: true,
        actions: [
            {
                action: 'view',
                title: 'Ver'
            },
            {
                action: 'dismiss',
                title: 'Descartar'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

/**
 * Manejo de clics en notificaciones
 */
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('🚀 Service Worker cargado y listo');