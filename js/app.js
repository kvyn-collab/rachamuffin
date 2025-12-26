/**
 * 🚀 Aplicación Principal Rachamuffin - Versión Modular
 * Punto de entrada principal que integra todos los módulos
 */

import { Utils, StorageManager } from './utils/utils.js';
import { NotificationSystem } from './components/NotificationSystem.js';
import { AvatarSystem } from './components/AvatarSystem.js';
import { GamificationSystem } from './components/GamificationSystem.js';

class RachamuffinApp {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.streak = 0;
        this.coins = 0;
        this.lastCheck = '';
        
        // Sistemas del app
        this.notificationSystem = null;
        this.avatarSystem = null;
        this.gamificationSystem = null;
        
        // Elementos de la UI
        this.elements = {};
        
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        try {
            console.log('🚀 Inicializando Rachamuffin App...');
            
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
            
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
            this.showError('Error al inicializar la aplicación');
        }
    }

    /**
     * Configuración principal de la aplicación
     */
    setup() {
        this.loadStoredData();
        this.initializeSystems();
        this.bindElements();
        this.setupEventListeners();
        this.setupOptimizations();
        this.initializeAppState();
        
        this.isInitialized = true;
        console.log('✅ Rachamuffin App inicializada correctamente');
    }

    /**
     * Carga datos almacenados
     */
    loadStoredData() {
        this.streak = parseInt(StorageManager.get('rachamuffin_streak', 0));
        this.coins = parseInt(StorageManager.get('rachamuffin_coins', 0));
        this.lastCheck = StorageManager.get('rachamuffin_lastCheck', '');
        
        const savedUser = StorageManager.get('rachamuffin_currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
        }
    }

    /**
     * Inicializa todos los sistemas
     */
    initializeSystems() {
        // Sistema de notificaciones
        this.notificationSystem = new NotificationSystem();
        
        // Sistema de avatar
        this.avatarSystem = new AvatarSystem();
        this.avatarSystem.init();
        
        // Sistema de gamificación
        this.gamificationSystem = new GamificationSystem();
        this.gamificationSystem.init();
    }

    /**
     * Vincula elementos de la UI
     */
    bindElements() {
        const elementIds = [
            'loginScreen', 'mainApp', 'usernameInput', 'passwordInput',
            'streak', 'coins', 'checkButton', 'message', 'avatar',
            'configModal', 'avatarModal', 'avatarPreview'
        ];
        
        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Eventos de autenticación
        this.bindAuthenticationEvents();
        
        // Eventos de misiones
        this.bindMissionEvents();
        
        // Eventos de modales
        this.bindModalEvents();
        
        // Eventos de teclado
        this.bindKeyboardEvents();
        
        // Eventos de redimensionamiento
        this.bindResizeEvents();
    }

    /**
     * Configura optimizaciones
     */
    setupOptimizations() {
        // Lazy loading de imágenes
        Utils.lazyLoadImages();
        
        // Detectar preferencias del usuario
        this.detectUserPreferences();
        
        // Configurar performance monitoring
        this.setupPerformanceMonitoring();
    }

    /**
     * Inicializa el estado de la aplicación
     */
    initializeAppState() {
        this.checkStreakBreak();
        this.updateDisplay();
        this.initializeApp();
    }

    // ========== SISTEMA DE AUTENTICACIÓN ==========

    bindAuthenticationEvents() {
        // Login y registro
        window.loginUser = this.loginUser.bind(this);
        window.registerUser = this.registerUser.bind(this);
        window.logoutFromApp = this.logoutFromApp.bind(this);
        window.logoutUser = this.logoutUser.bind(this);
    }

    async loginUser() {
        const username = this.elements.usernameInput?.value.trim();
        const password = this.elements.passwordInput?.value.trim();

        if (!username || !password) {
            this.notificationSystem.warning('Por favor completa todos los campos');
            return;
        }

        if (!Utils.isValidEmail(username) && username.length < 3) {
            this.notificationSystem.warning('Usuario inválido');
            return;
        }

        try {
            const users = JSON.parse(StorageManager.get('rachamuffin_users', '{}'));
            const user = users[username];

            if (!user || user.password !== btoa(password)) {
                this.notificationSystem.error('Usuario o contraseña incorrectos');
                return;
            }

            // Login exitoso
            user.username = username;
            StorageManager.set('rachamuffin_currentUser', user);
            this.currentUser = user;

            this.notificationSystem.success(`¡Bienvenido de vuelta, ${username}!`);
            this.showMainApp();
            
        } catch (error) {
            console.error('Error en login:', error);
            this.notificationSystem.error('Error interno del servidor');
        }
    }

    async registerUser() {
        const username = this.elements.usernameInput?.value.trim();
        const password = this.elements.passwordInput?.value.trim();

        if (!username || !password) {
            this.notificationSystem.warning('Por favor completa todos los campos');
            return;
        }

        if (!Utils.isValidEmail(username) && username.length < 3) {
            this.notificationSystem.warning('Usuario debe tener al menos 3 caracteres');
            return;
        }

        if (password.length < 6) {
            this.notificationSystem.warning('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const users = JSON.parse(StorageManager.get('rachamuffin_users', '{}'));
            
            if (users[username]) {
                this.notificationSystem.warning('El usuario ya existe');
                return;
            }

            const newUser = {
                password: btoa(password),
                streak: 0,
                coins: 0,
                streakType: 'exercise',
                customStreak: '',
                avatarSeed: 'Lucky',
                avatarStyle: 'adventurer',
                avatarName: username,
                lastCheck: '',
                // Personalización avanzada
                hairColor: '',
                eyeColor: '',
                accessory: '',
                clothing: '',
                background: '',
                mood: '',
                pet: '',
                effect: '',
                createdAt: new Date().toISOString()
            };

            users[username] = newUser;
            StorageManager.set('rachamuffin_users', JSON.stringify(users));
            StorageManager.set('rachamuffin_currentUser', JSON.stringify(newUser));
            
            this.currentUser = newUser;
            this.notificationSystem.success('¡Usuario registrado exitosamente!');
            this.showMainApp();
            
        } catch (error) {
            console.error('Error en registro:', error);
            this.notificationSystem.error('Error al registrar usuario');
        }
    }

    logoutFromApp() {
        if (confirm('¿Seguro que quieres cerrar sesión?')) {
            StorageManager.remove('rachamuffin_currentUser');
            this.currentUser = null;
            this.showLoginScreen();
            
            // Limpiar campos
            if (this.elements.usernameInput) this.elements.usernameInput.value = '';
            if (this.elements.passwordInput) this.elements.passwordInput.value = '';
            
            this.notificationSystem.info('Sesión cerrada');
        }
    }

    logoutUser() {
        StorageManager.remove('rachamuffin_currentUser');
        this.currentUser = null;
        this.showLoginScreen();
        
        if (this.elements.usernameInput) this.elements.usernameInput.value = '';
        if (this.elements.passwordInput) this.elements.passwordInput.value = '';
    }

    // ========== SISTEMA DE MISIONES ==========

    bindMissionEvents() {
        window.completeMission = this.completeMission.bind(this);
        window.resetGame = this.resetGame.bind(this);
    }

    completeMission() {
        const today = new Date().toDateString();

        // Verificar si ya completó la misión hoy
        if (this.lastCheck === today) {
            const streakName = this.getStreakTypeName();
            this.notificationSystem.info(`¡Ya cumpliste tu misión de ${streakName} hoy, Guerrero!`);
            return;
        }

        // Completar misión
        this.streak++;
        this.coins += 10;
        this.lastCheck = today;

        // Guardar datos
        this.saveData();
        
        // Activar sistemas
        this.activateSuccessEffects();
        this.gamificationSystem.recordMissionCompletion();
        
        // Actualizar UI
        this.updateDisplay();
        
        // Verificar evolución del avatar
        this.avatarSystem.checkEvolution();
        
        // Mensaje de éxito
        if (!this.elements.message?.textContent.includes("evolucionado")) {
            this.setMessage("¡Nivel de poder aumentando!");
        }
        
        // Deshabilitar botón
        if (this.elements.checkButton) {
            this.elements.checkButton.disabled = true;
            this.elements.checkButton.textContent = "¡COMPLETADO!";
        }

        this.notificationSystem.success('¡Misión completada! 🎯');
    }

    activateSuccessEffects() {
        // Animación del botón
        if (this.elements.checkButton) {
            this.elements.checkButton.classList.add('success-animation');
            setTimeout(() => {
                this.elements.checkButton.classList.remove('success-animation');
            }, 600);
        }

        // Animación del contenedor
        const container = document.querySelector('.container');
        if (container) {
            container.style.animation = 'containerGlow 0.5s ease-in-out';
            setTimeout(() => {
                container.style.animation = 'containerGlow 3s ease-in-out infinite alternate';
            }, 500);
        }

        // Crear partículas
        this.createSuccessParticles();
        
        // Animar números
        this.animateNumbers();
    }

    createSuccessParticles() {
        const colors = ['#ff4757', '#ffa502', '#8b5cf6', '#06b6d4'];
        const container = document.querySelector('.container');
        if (!container) return;

        const isMobile = Utils.isMobile();
        const particleCount = isMobile ? 8 : 15;

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: ${isMobile ? '4px' : '6px'};
                    height: ${isMobile ? '4px' : '6px'};
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: particleFloat 1s ease-out forwards;
                    z-index: 1000;
                `;
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }, i * (isMobile ? 80 : 50));
        }
    }

    animateNumbers() {
        const streakNumber = document.getElementById('streak');
        const coinsNumber = document.getElementById('coins');
        
        if (streakNumber) {
            streakNumber.style.animation = 'numberPulse 0.6s ease-in-out';
            setTimeout(() => {
                streakNumber.style.animation = '';
            }, 600);
        }
        
        if (coinsNumber) {
            coinsNumber.style.animation = 'numberPulse 0.6s ease-in-out';
            setTimeout(() => {
                coinsNumber.style.animation = '';
            }, 600);
        }
    }

    resetGame() {
        if (confirm("¿Seguro que quieres borrar tu progreso?")) {
            StorageManager.clear();
            location.reload();
        }
    }

    // ========== SISTEMA DE MODALES ==========

    bindModalEvents() {
        window.openConfigModal = this.openConfigModal.bind(this);
        window.closeConfigModal = this.closeConfigModal.bind(this);
        window.openAvatarModal = this.openAvatarModal.bind(this);
        window.closeAvatarModal = this.closeAvatarModal.bind(this);
        window.saveUserConfig = this.saveUserConfig.bind(this);
    }

    openConfigModal() {
        if (!this.currentUser) {
            this.notificationSystem.warning('Debes iniciar sesión primero');
            return;
        }
        
        if (this.elements.configModal) {
            this.elements.configModal.style.display = 'block';
            this.loadUserConfig();
        }
        
        document.body.style.overflow = 'hidden';
    }

    closeConfigModal() {
        if (this.elements.configModal) {
            this.elements.configModal.style.display = 'none';
        }
        document.body.style.overflow = '';
    }

    openAvatarModal() {
        if (!this.currentUser) {
            this.notificationSystem.warning('Debes iniciar sesión primero');
            return;
        }
        
        if (this.elements.avatarModal) {
            this.elements.avatarModal.style.display = 'block';
            this.loadAvatarConfig();
        }
        
        document.body.style.overflow = 'hidden';
    }

    closeAvatarModal() {
        if (this.elements.avatarModal) {
            this.elements.avatarModal.style.display = 'none';
        }
        document.body.style.overflow = '';
    }

    saveUserConfig() {
        if (!this.currentUser) {
            this.notificationSystem.warning('Debes iniciar sesión primero');
            return;
        }

        const selectedStreakType = document.querySelector('input[name="streakType"]:checked');
        if (!selectedStreakType) {
            this.notificationSystem.warning('Selecciona un tipo de racha');
            return;
        }

        const streakType = selectedStreakType.value;
        let customStreak = '';

        if (streakType === 'custom') {
            customStreak = document.getElementById('customStreakText')?.value.trim();
            if (!customStreak) {
                this.notificationSystem.warning('Describe tu racha personalizada');
                return;
            }
        }

        // Actualizar usuario
        this.currentUser.streakType = streakType;
        this.currentUser.customStreak = customStreak;

        // Guardar en storage global
        const users = JSON.parse(StorageManager.get('rachamuffin_users', '{}'));
        const username = Object.keys(users).find(key => 
            users[key].avatarName === this.currentUser.avatarName
        );
        
        if (username) {
            users[username] = this.currentUser;
            StorageManager.set('rachamuffin_users', JSON.stringify(users));
        }

        StorageManager.set('rachamuffin_currentUser', this.currentUser);
        this.notificationSystem.success('¡Configuración guardada exitosamente!');
        this.closeConfigModal();
    }

    // ========== EVENTOS DE TECLADO Y REDIMENSIONAMIENTO ==========

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeConfigModal();
                this.closeAvatarModal();
            }
        });
    }

    bindResizeEvents() {
        let resizeTimeout;
        window.addEventListener('resize', Utils.debounce(() => {
            this.updateResponsiveElements();
        }, 150));
    }

    updateResponsiveElements() {
        const isMobile = Utils.isMobile();
        if (isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    // ========== UTILIDADES ==========

    checkStreakBreak() {
        if (this.lastCheck && this.lastCheck !== "") {
            const lastCheckDate = new Date(this.lastCheck);
            const today = new Date();
            const timeDifference = today.getTime() - lastCheckDate.getTime();
            const hoursDifference = timeDifference / (1000 * 3600);

            if (hoursDifference > 48) {
                this.streak = 0;
                this.coins = Math.max(0, this.coins - 20);
                this.saveData();
                
                this.gamificationSystem.recordStreakBreak();
                
                this.notificationSystem.warning('¡Has roto tu racha!', {
                    duration: 6000
                });
            }
        }
    }

    getStreakTypeName() {
        if (this.currentUser) {
            const type = this.currentUser.streakType;
            const custom = this.currentUser.customStreak;
            
            const names = {
                'exercise': 'ejercicio',
                'study': 'estudio',
                'diet': 'dieta saludable',
                'smoking': 'dejar de fumar',
                'reading': 'lectura',
                'meditation': 'meditación',
                'custom': custom || 'racha personalizada'
            };
            
            return names[type] || 'racha';
        }
        return 'racha';
    }

    setMessage(text) {
        if (this.elements.message) {
            this.elements.message.textContent = text;
        }
    }

    showLoginScreen() {
        if (this.elements.loginScreen) {
            this.elements.loginScreen.style.display = 'flex';
        }
        if (this.elements.mainApp) {
            this.elements.mainApp.style.display = 'none';
        }
    }

    showMainApp() {
        if (this.elements.loginScreen) {
            this.elements.loginScreen.style.display = 'none';
        }
        if (this.elements.mainApp) {
            this.elements.mainApp.style.display = 'block';
        }
    }

    loadUserConfig() {
        if (!this.currentUser || !this.elements.configModal) return;

        const streakType = this.currentUser.streakType || 'exercise';
        const streakRadio = document.querySelector(`input[value="${streakType}"]`);
        if (streakRadio) {
            streakRadio.checked = true;
        }

        if (streakType === 'custom') {
            const customInput = document.getElementById('customStreakInput');
            const customText = document.getElementById('customStreakText');
            if (customInput) customInput.style.display = 'block';
            if (customText) customText.value = this.currentUser.customStreak || '';
        }

        // Setup listener para custom input
        this.setupCustomStreakListener();
    }

    loadAvatarConfig() {
        if (!this.currentUser || !this.avatarSystem) return;

        const avatar = this.avatarSystem.currentAvatar;
        
        // Cargar configuración básica
        const nameInput = document.getElementById('avatarNameInput');
        const styleSelect = document.getElementById('avatarStyleSelect');
        
        if (nameInput) nameInput.value = avatar.name || 'Hero';
        if (styleSelect) styleSelect.value = avatar.style || 'adventurer';
        
        // Cargar personalización avanzada
        const advancedFields = [
            'hairColorSelect', 'eyeColorSelect', 'accessorySelect',
            'clothingSelect', 'backgroundSelect', 'moodSelect',
            'petSelect', 'effectSelect'
        ];
        
        advancedFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const key = fieldId.replace('Select', '');
            if (field && avatar.customization[key]) {
                field.value = avatar.customization[key];
            }
        });
        
        this.avatarSystem.updateAvatarInDOM('avatarPreview');
    }

    setupCustomStreakListener() {
        const customRadio = document.querySelector('input[value="custom"]');
        const customInput = document.getElementById('customStreakInput');
        
        if (customRadio && customInput) {
            customRadio.addEventListener('change', () => {
                if (customRadio.checked) {
                    customInput.style.display = 'block';
                }
            });
        }

        const otherRadios = document.querySelectorAll('input[name="streakType"]:not([value="custom"])');
        otherRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (customInput) customInput.style.display = 'none';
            });
        });
    }

    detectUserPreferences() {
        // Detectar preferencia de tema
        const prefersDark = Utils.getPreferredTheme() === 'dark';
        if (prefersDark) {
            document.body.classList.add('dark-theme');
        }

        // Detectar reduced motion
        if (Utils.prefersReducedMotion()) {
            document.body.classList.add('reduced-motion');
        }
    }

    setupPerformanceMonitoring() {
        // Monitoreo básico de performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('🚀 Performance:', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
                    });
                }, 0);
            });
        }
    }

    // ========== GESTIÓN DE DATOS ==========

    saveData() {
        StorageManager.set('rachamuffin_streak', this.streak);
        StorageManager.set('rachamuffin_coins', this.coins);
        StorageManager.set('rachamuffin_lastCheck', this.lastCheck);
    }

    updateDisplay() {
        // Actualizar elementos básicos
        if (this.elements.streak) {
            this.elements.streak.textContent = Utils.formatNumber(this.streak);
        }
        
        if (this.elements.coins) {
            this.elements.coins.textContent = Utils.formatNumber(this.coins);
        }

        // Actualizar avatar
        this.avatarSystem.updateAvatarInDOM();
        
        // Actualizar gamificación
        this.gamificationSystem.updateStatsDisplay();

        // Verificar estado del botón
        const today = new Date().toDateString();
        if (this.lastCheck === today && this.elements.checkButton) {
            this.elements.checkButton.disabled = true;
            this.elements.checkButton.textContent = "¡COMPLETADO!";
        } else if (this.elements.checkButton) {
            this.elements.checkButton.disabled = false;
            this.elements.checkButton.textContent = "¡MISIÓN CUMPLIDA!";
        }
    }

    initializeApp() {
        // Verificar si hay usuario guardado
        const savedUser = StorageManager.get('rachamuffin_currentUser');
        if (savedUser) {
            try {
                this.currentUser = savedUser;
                this.showMainApp();
                this.updateDisplay();
            } catch (e) {
                this.showLoginScreen();
            }
        } else {
            this.showLoginScreen();
        }
    }

    showError(message) {
        console.error(message);
        // Fallback a alert si no hay sistema de notificaciones
        if (!this.notificationSystem) {
            alert(message);
        } else {
            this.notificationSystem.error(message);
        }
    }

    // ========== API PÚBLICA ==========

    /**
     * Exporta todos los datos del usuario
     */
    exportUserData() {
        const exportData = {
            user: this.currentUser,
            game: {
                streak: this.streak,
                coins: this.coins,
                lastCheck: this.lastCheck
            },
            avatar: this.avatarSystem.exportAvatar(),
            gamification: this.gamificationSystem.exportGamificationData(),
            storage: StorageManager.exportData(),
            timestamp: new Date().toISOString(),
            version: '2.0'
        };
        
        return exportData;
    }

    /**
     * Importa datos del usuario
     */
    importUserData(data) {
        try {
            if (data.user) this.currentUser = data.user;
            if (data.game) {
                this.streak = data.game.streak || 0;
                this.coins = data.game.coins || 0;
                this.lastCheck = data.game.lastCheck || '';
            }
            if (data.avatar) this.avatarSystem.importAvatar(data.avatar);
            if (data.gamification) this.gamificationSystem.importGamificationData(data.gamification);
            if (data.storage) StorageManager.importData(data.storage);
            
            this.saveData();
            this.updateDisplay();
            
            this.notificationSystem.success('¡Datos importados exitosamente!');
            return true;
        } catch (error) {
            console.error('Error importando datos:', error);
            this.notificationSystem.error('Error al importar datos');
            return false;
        }
    }
}

// Inicializar aplicación cuando se carga el script
const app = new RachamuffinApp();

// Hacer disponible globalmente para debugging
window.rachamuffinApp = app;

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RachamuffinApp;
}
