/**
 * 🛠️ Utilidades del Sistema Rachamuffin
 * Funciones de utilidad general y helpers
 */

export class Utils {
    /**
     * Formatea números con separadores de miles
     */
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * Debounce function para optimizar eventos
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    /**
     * Throttle function para limitar frecuencia de ejecución
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Genera ID único
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Valida email
     */
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Sanitiza entrada de usuario
     */
    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    /**
     * Convierte fecha a string ISO
     */
    static dateToISO(date) {
        return new Date(date).toISOString().split('T')[0];
    }

    /**
     * Calcula diferencia en días entre fechas
     */
    static daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((new Date(date1) - new Date(date2)) / oneDay));
    }

    /**
     * Formatea tiempo relativo (hace X minutos, etc.)
     */
    static timeAgo(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'ahora mismo';
        if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        if (hours < 24) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
        return `hace ${days} día${days > 1 ? 's' : ''}`;
    }

    /**
     * Clamp function para limitar valores
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Interpola entre dos valores
     */
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    /**
     * Smooth scroll a elemento
     */
    static scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Detecta si es dispositivo móvil
     */
    static isMobile() {
        return window.innerWidth <= 768;
    }

    /**
     * Detecta si soporta WebP
     */
    static supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    /**
     * Lazy load para imágenes
     */
    static lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Copia texto al portapapeles
     */
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Error al copiar al portapapeles:', err);
            return false;
        }
    }

    /**
     * Detecta reduced motion preference
     */
    static prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Detecta theme preference
     */
    static getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}

/**
 * Storage Manager para manejo de datos
 */
export class StorageManager {
    /**
     * Guarda datos en localStorage con validación
     */
    static set(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
            return false;
        }
    }

    /**
     * Obtiene datos de localStorage con validación
     */
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error obteniendo de localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Elimina datos de localStorage
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error eliminando de localStorage:', error);
            return false;
        }
    }

    /**
     * Limpia todo el localStorage del proyecto
     */
    static clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('rachamuffin_')) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error limpiando localStorage:', error);
            return false;
        }
    }

    /**
     * Exporta todos los datos del proyecto
     */
    static exportData() {
        const data = {};
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('rachamuffin_')) {
                data[key] = this.get(key);
            }
        });
        return {
            version: '2.0',
            timestamp: new Date().toISOString(),
            data: data
        };
    }

    /**
     * Importa datos al proyecto
     */
    static importData(jsonData) {
        try {
            if (!jsonData.data) throw new Error('Datos inválidos');
            
            Object.keys(jsonData.data).forEach(key => {
                if (key.startsWith('rachamuffin_')) {
                    this.set(key, jsonData.data[key]);
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error importando datos:', error);
            return false;
        }
    }
}

/**
 * Event Manager para manejo de eventos
 */
export class EventManager {
    constructor() {
        this.events = {};
    }

    /**
     * Registra un event listener
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    /**
     * Elimina un event listener
     */
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }

    /**
     * Emite un evento
     */
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    /**
     * Una vez event listener
     */
    once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
}