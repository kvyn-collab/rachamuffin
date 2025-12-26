# 🚀 Rachamuffin - Documentación Técnica Completa

## 📋 Índice

1. [Visión General](#visión-general)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Funcionalidades Principales](#funcionalidades-principales)
5. [API y Módulos](#api-y-módulos)
6. [PWA y Funcionalidades Offline](#pwa-y-funcionalidades-offline)
7. [Sistema de Gamificación](#sistema-de-gamificación)
8. [Personalización de Avatares](#personalización-de-avatares)
9. [Accesibilidad y Responsive](#accesibilidad-y-responsive)
10. [Performance y Optimización](#performance-y-optimización)
11. [Desarrollo y Contribución](#desarrollo-y-contribución)
12. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Visión General

**Rachamuffin** es una Progressive Web App (PWA) diseñada para ayudar a los usuarios a crear y mantener hábitos positivos a través de un sistema de seguimiento de rachas gamificado con temática de héroe/anime.

### ✨ Características Principales

- 🦸 **Sistema de Rachas**: Seguimiento de hábitos diarios
- 🎮 **Gamificación**: Logros, niveles, monedas virtuales
- 🎨 **Avatar Personalizable**: Sistema avanzado de personalización
- 📱 **PWA Completa**: Instalable, offline-first
- ♿ **Accesible**: Cumple estándares WCAG 2.1
- 🌙 **Multi-tema**: Modo claro/oscuro
- 📊 **Estadísticas Detalladas**: Métricas y progreso visual
- 🔄 **Sincronización**: Preparado para backend futuro

---

## 🛠️ Instalación y Configuración

### Prerrequisitos

- **Navegador moderno** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Servidor web local** (opcional pero recomendado)
- **Git** (para clonar el repositorio)

### Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/rachamuffin.git
cd rachamuffin

# 2. Servir archivos (opcional)
# Opción A: Python
python -m http.server 8000

# Opción B: Node.js (http-server)
npx http-server -p 8000

# Opción C: PHP
php -S localhost:8000
```

### Instalación para Desarrollo

```bash
# 1. Instalar dependencias globales (opcional)
npm install -g live-server

# 2. Iniciar servidor de desarrollo
live-server --port=8000 --open=/index_modern.html

# 3. Abrir en navegador
# http://localhost:8000/index_modern.html
```

### Configuración del Entorno

#### Variables de Configuración

```javascript
// config.js
export const CONFIG = {
    // Configuración de la aplicación
    APP_NAME: 'Rachamuffin',
    VERSION: '2.0.0',
    
    // Configuración de almacenamiento
    STORAGE_KEYS: {
        USER: 'rachamuffin_currentUser',
        STREAK: 'rachamuffin_streak',
        COINS: 'rachamuffin_coins',
        AVATAR: 'rachamuffin_currentAvatar',
        THEME: 'rachamuffin_theme'
    },
    
    // Configuración de gamificación
    GAMIFICATION: {
        EXP_PER_MISSION: 10,
        COINS_PER_MISSION: 10,
        STREAK_PENALTY: 20,
        EVOLUTION_INTERVAL: 5
    },
    
    // Configuración de APIs
    APIs: {
        AVATAR_BASE: 'https://api.dicebear.com/7.x/',
        CACHE_TIMEOUT: 24 * 60 * 60 * 1000 // 24 horas
    }
};
```

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
rachamuffin/
├── 📄 index.html                 # Versión original
├── 📄 index_modern.html          # Versión PWA mejorada
├── 📄 manifest.json              # PWA manifest
├── 📄 sw.js                      # Service Worker
├── 📁 js/                        # JavaScript modular
│   ├── 📄 app.js                 # Aplicación principal
│   ├── 📁 utils/                 # Utilidades
│   │   └── 📄 utils.js           # Funciones de utilidad
│   ├── 📁 components/            # Componentes UI
│   │   ├── 📄 NotificationSystem.js
│   │   ├── 📄 AvatarSystem.js
│   │   └── 📄 GamificationSystem.js
│   └── 📁 api/                   # Manejo de APIs
├── 📁 assets/                    # Recursos estáticos
│   ├── 📁 css/                   # Hojas de estilo
│   ├── 📁 js/                    # JavaScript legacy
│   └── 📁 images/                # Imágenes e iconos
├── 📁 docs/                      # Documentación
│   ├── 📄 README_COMPLETO.md     # Esta documentación
│   ├── 📄 INSTALLATION.md        # Guía de instalación
│   └── 📄 API.md                 # Documentación de API
├── 📁 tests/                     # Tests unitarios
└── 📁 dist/                      # Archivos de producción
```

### Patrones de Diseño

#### 1. **Module Pattern**
```javascript
// Cada módulo es autocontenido y exporta su API
export class NotificationSystem {
    constructor() {
        // Inicialización
    }
    
    show(message, type, options) {
        // Implementación
    }
}
```

#### 2. **Observer Pattern**
```javascript
// Sistema de eventos para comunicación entre módulos
export class EventManager {
    on(event, callback) {
        // Registrar listener
    }
    
    emit(event, data) {
        // Notificar listeners
    }
}
```

#### 3. **Strategy Pattern**
```javascript
// Diferentes estrategias de caching
const strategies = {
    cacheFirst: cacheFirstStrategy,
    networkFirst: networkFirstStrategy,
    staleWhileRevalidate: staleWhileRevalidateStrategy
};
```

---

## ⚡ Funcionalidades Principales

### 1. Sistema de Autenticación

```javascript
// Ejemplo de uso
const app = new RachamuffinApp();

// Login
await app.loginUser('usuario@email.com', 'password');

// Registro
await app.registerUser('nuevo@email.com', 'password');

// Logout
app.logoutFromApp();
```

**Características:**
- Validación de formularios
- Hash seguro de contraseñas (base64)
- Persistencia en localStorage
- Manejo de sesiones

### 2. Seguimiento de Rachas

```javascript
// Completar misión
app.completeMission();

// Verificar estado
const today = new Date().toDateString();
const hasCompletedToday = app.lastCheck === today;
```

**Características:**
- Validación de un completado por día
- Penalización por romper racha
- Cálculo automático de streaks
- Historial persistente

### 3. Sistema de Monedas

```javascript
// Obtener monedas del usuario
const coins = StorageManager.get('rachamuffin_coins', 0);

// Agregar monedas
StorageManager.set('rachamuffin_coins', coins + 10);

// Gastar monedas (futuro)
function spendCoins(amount) {
    const current = StorageManager.get('rachamuffin_coins', 0);
    if (current >= amount) {
        StorageManager.set('rachamuffin_coins', current - amount);
        return true;
    }
    return false;
}
```

---

## 🔌 API y Módulos

### Utils Module

```javascript
import { Utils, StorageManager } from './utils/utils.js';

// Formateo de números
Utils.formatNumber(1234567); // "1,234,567"

// Debounce para eventos
const debouncedHandler = Utils.debounce(handleResize, 150);

// Validación de email
Utils.isValidEmail('user@example.com'); // true

// Storage con validación
StorageManager.set('user_preference', { theme: 'dark' });
const theme = StorageManager.get('user_preference');
```

### NotificationSystem

```javascript
import { NotificationSystem } from './components/NotificationSystem.js';

const notifications = new NotificationSystem();

// Notificaciones básicas
notifications.success('¡Misión completada!');
notifications.warning('Recuerda hacer tu tarea diaria');
notifications.error('Error al guardar datos');

// Notificaciones avanzadas
notifications.show('Descarga completa', 'success', {
    duration: 5000,
    persistent: true,
    actions: [
        { label: 'Ver', callback: () => openFile() },
        { label: 'Ignorar', callback: () => dismiss() }
    ]
});

// Confirmación
notifications.confirm(
    '¿Eliminar todos los datos?',
    () => deleteAllData(),
    () => cancelDelete()
);
```

### AvatarSystem

```javascript
import { AvatarSystem } from './components/AvatarSystem.js';

const avatar = new AvatarSystem();

// Inicializar
avatar.init();

// Personalizar avatar
avatar.updateAvatar({
    name: 'MiHéroe',
    style: 'adventurer',
    customization: {
        hairColor: 'blue',
        eyeColor: 'green',
        accessory: 'glasses'
    }
});

// Avatar aleatorio
avatar.applyRandomAvatar();

// Guardar preset
const presetId = avatar.savePreset('Mi Avatar Cool');

// Cargar preset
avatar.loadPreset(presetId);

// Información de nivel
const levelInfo = avatar.getLevelInfo();
const progress = avatar.getLevelProgress(); // 0-100
```

### GamificationSystem

```javascript
import { GamificationSystem } from './components/GamificationSystem.js';

const gamification = new GamificationSystem();

// Inicializar
gamification.init();

// Registrar misión completada
gamification.recordMissionCompletion();

// Verificar logros
const achievements = gamification.checkAchievements();

// Obtener estadísticas
const stats = gamification.getDisplayStats();
console.log(stats);
// {
//     level: 5,
//     exp: 75,
//     expToNext: 100,
//     progress: 75,
//     currentStreak: 12,
//     maxStreak: 25,
//     totalStreaks: 156,
//     titles: ['Constante', 'Dedicado'],
//     achievements: 8
// }

// Desafíos diarios
const challenges = gamification.checkDailyChallenges();
```

---

## 📱 PWA y Funcionalidades Offline

### Service Worker

El Service Worker proporciona:

1. **Caching Inteligente**
   - Cache First para recursos estáticos
   - Network First para APIs
   - Stale While Revalidate para contenido dinámico

2. **Funcionalidad Offline**
   - Página offline personalizada
   - Datos en caché para uso sin conexión
   - Sincronización cuando vuelve la conexión

3. **Estrategias de Cache**

```javascript
// Cache First: Para archivos estáticos
if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request));
}

// Network First: Para APIs
if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request));
}
```

### Manifest Configuration

```json
{
    "name": "Rachamuffin - Hero Streak Tracker",
    "short_name": "Rachamuffin",
    "start_url": "/index_modern.html",
    "display": "standalone",
    "theme_color": "#ff4757",
    "background_color": "#0a0a0a",
    "icons": [...],
    "shortcuts": [
        {
            "name": "Nueva Misión",
            "url": "/?action=new-mission"
        }
    ]
}
```

### Instalación PWA

```javascript
// Detectar si se puede instalar
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar botón de instalación
    showInstallButton();
});

// Instalar app
async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('PWA instalada');
        }
        
        deferredPrompt = null;
    }
}
```

---

## 🎮 Sistema de Gamificación

### Estructura de Logros

```javascript
const achievements = [
    {
        id: 'first_streak',
        name: 'Primeros Pasos',
        description: 'Completa tu primera misión',
        icon: '🎯',
        category: 'streak',
        condition: (stats) => stats.totalStreaks >= 1,
        reward: { coins: 50, title: 'Novato' }
    },
    // ... más logros
];
```

### Sistema de Niveles

```javascript
const evolutionLevels = [
    { level: 0, name: "Novato", minStreak: 0 },
    { level: 1, name: "Aprendiz", minStreak: 5 },
    { level: 2, name: "Guerrero", minStreak: 10 },
    // ... más niveles
];

// Calcular nivel actual
const currentLevel = Math.floor(streak / 5);
```

### Desafíos Diarios

```javascript
const dailyChallenges = [
    {
        id: 'daily_streak',
        name: 'Mantén tu Racha',
        description: 'Completa tu misión diaria',
        target: 1,
        reward: { coins: 25, exp: 10 }
    }
    // ... más desafíos
];
```

---

## 🎨 Personalización de Avatares

### Generación de Avatares

```javascript
// URL base de DiceBear API
const avatarURL = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

// Con personalización
const customURL = `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}&hairColor=${hairColor}&eyeColor=${eyeColor}&accessories=${accessory}`;
```

### Sistema de Presets

```javascript
// Guardar preset
const preset = {
    id: generateId(),
    name: 'Mi Avatar Cool',
    avatar: currentAvatar,
    timestamp: Date.now()
};

// Cargar preset
function loadPreset(presetId) {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
        updateAvatar(preset.avatar);
    }
}
```

### Evolución Automática

```javascript
// El avatar evoluciona cada 5 rachas
function checkEvolution() {
    const newLevel = Math.floor(streak / 5);
    const oldLevel = Math.floor(lastAvatarUpdate / 5);
    
    if (newLevel > oldLevel) {
        triggerEvolutionAnimation(newLevel);
    }
}
```

---

## ♿ Accesibilidad y Responsive

### Estándares WCAG 2.1

```html
<!-- Navegación por teclado -->
<button aria-label="Cerrar modal" aria-describedby="modal-description">
    ✕
</button>

<!-- Screen readers -->
<div aria-live="polite" aria-label="Notificaciones">
    <!-- Notificaciones aparecen aquí -->
</div>

<!-- Skip links -->
<a href="#mainContent" class="sr-only">Saltar al contenido principal</a>
```

### Responsive Design

```css
/* Mobile First */
.container {
    padding: 1rem;
}

@media (min-width: 768px) {
    .container {
        max-width: 400px;
        padding: 2rem;
    }
}

@media (min-width: 1024px) {
    .container {
        max-width: 500px;
    }
}
```

### Soporte para Discapacidades

```css
/* High contrast mode */
@media (prefers-contrast: high) {
    :root {
        --primary: #0000ff;
        --bg-primary: #ffffff;
        --text-primary: #000000;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## ⚡ Performance y Optimización

### Lazy Loading

```javascript
// Lazy loading de imágenes
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}
```

### Debouncing y Throttling

```javascript
// Debounce para eventos frecuentes
const debouncedResize = Utils.debounce(() => {
    updateLayout();
}, 150);

// Throttle para scroll
const throttledScroll = Utils.throttle(() => {
    handleScroll();
}, 16); // ~60fps
```

### Optimización de Animaciones

```css
/* Usar transform y opacity para mejor performance */
.avatar-evolving {
    transform: scale3d(1, 1, 1);
    opacity: 1;
    transition: transform 0.3s ease, opacity 0.3s ease;
    will-change: transform, opacity;
}

/* Evitar animaciones costosas */
@media (prefers-reduced-motion: reduce) {
    .avatar-evolving {
        animation: none !important;
    }
}
```

---

## 🧪 Desarrollo y Contribución

### Configuración del Entorno de Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/rachamuffin.git
cd rachamuffin

# Instalar herramientas de desarrollo
npm install -g live-server eslint prettier

# Configurar pre-commit hooks
npm install --save-dev husky lint-staged
```

### Estructura de Commits

```bash
# FormatoConventional Commits
feat: agregar nuevo sistema de logros
fix: corregir bug en validación de formularios
docs: actualizar documentación de API
style: mejorar formato de código CSS
refactor: reorganizar componentes de UI
test: agregar tests para sistema de notificaciones
chore: actualizar dependencias
```

### Testing

```javascript
// Ejemplo de test unitario
import { Utils } from '../js/utils/utils.js';

describe('Utils', () => {
    test('formatNumber debería formatear números correctamente', () => {
        expect(Utils.formatNumber(1234567)).toBe('1,234,567');
        expect(Utils.formatNumber(1000)).toBe('1,000');
    });
    
    test('isValidEmail debería validar emails correctamente', () => {
        expect(Utils.isValidEmail('test@example.com')).toBe(true);
        expect(Utils.isValidEmail('invalid-email')).toBe(false);
    });
});
```

### Contribución

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'feat: agregar AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** un Pull Request

---

## 🔧 Solución de Problemas

### Problemas Comunes

#### 1. **Service Worker no se registra**

```javascript
// Verificar soporte
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('SW registrado:', registration);
        })
        .catch(error => {
            console.error('SW falló:', error);
        });
} else {
    console.log('Service Worker no soportado');
}
```

#### 2. **Problemas de Caching**

```javascript
// Limpiar cache manualmente
async function clearCache() {
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
    }
}
```

#### 3. **Datos no se guardan**

```javascript
// Verificar localStorage
function checkStorage() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        console.error('localStorage no disponible:', error);
        return false;
    }
}
```

### Debugging

```javascript
// Habilitar modo debug
const DEBUG = true;

if (DEBUG) {
    console.log('Estado de la aplicación:', {
        streak: app.streak,
        coins: app.coins,
        currentUser: app.currentUser
    });
}

// Monitorear performance
window.addEventListener('load', () => {
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Performance:', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
        });
    }, 0);
});
```

---

## 📈 Roadmap Futuro

### Versión 2.1
- [ ] Backend con Node.js/Express
- [ ] Base de datos MongoDB/PostgreSQL
- [ ] Autenticación OAuth2
- [ ] API REST completa

### Versión 2.2
- [ ] Sincronización en tiempo real
- [ ] Modo colaborativo
- [ ] Integraciones con wearables
- [ ] Análisis predictivo de hábitos

### Versión 3.0
- [ ] Aplicación móvil nativa (React Native)
- [ ] Realidad aumentada para gamificación
- [ ] IA para recomendaciones personalizadas
- [ ] Ecosistema de plugins

---

## 📞 Soporte

- **GitHub Issues**: [Reportar bugs](https://github.com/tu-usuario/rachamuffin/issues)
- **Email**: soporte@rachamuffin.app
- **Discord**: [Servidor de la comunidad](https://discord.gg/rachamuffin)

---

## 📄 Licencia

Este proyecto está licenciado bajo la MIT License - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Desarrollado con ❤️ para ayudar a crear hábitos positivos**

*Última actualización: 26 de Diciembre, 2025*