/**
 * 🎨 Sistema de Avatar Mejorado
 * Manejo completo de personalización de avatares
 */

import { Utils, StorageManager } from '../utils/utils.js';

export class AvatarSystem {
    constructor() {
        this.currentAvatar = null;
        this.presets = this.loadPresets();
        this.isEvolutionAnimating = false;
        this.evolutionLevels = [
            { level: 0, name: "Novato", minStreak: 0 },
            { level: 1, name: "Aprendiz", minStreak: 5 },
            { level: 2, name: "Guerrero", minStreak: 10 },
            { level: 3, name: "Héroe", minStreak: 20 },
            { level: 4, name: "Leyenda", minStreak: 35 },
            { level: 5, name: "Maestro", minStreak: 50 },
            { level: 6, name: "Gran Maestro", minStreak: 75 },
            { level: 7, name: "Épico", minStreak: 100 },
            { level: 8, name: "Legendario", minStreak: 150 },
            { level: 9, name: "Mítico", minStreak: 200 },
            { level: 10, name: "Divino", minStreak: 300 }
        ];
    }

    /**
     * Inicializa el sistema de avatar
     */
    init() {
        this.loadCurrentAvatar();
        this.setupStyles();
    }

    /**
     * Carga el avatar actual del usuario
     */
    loadCurrentAvatar() {
        const savedAvatar = StorageManager.get('rachamuffin_currentAvatar');
        if (savedAvatar) {
            this.currentAvatar = savedAvatar;
        } else {
            this.currentAvatar = this.getDefaultAvatar();
        }
    }

    /**
     * Avatar por defecto
     */
    getDefaultAvatar() {
        return {
            name: 'Hero',
            style: 'adventurer',
            seed: 'Lucky',
            customization: {
                hairColor: '',
                eyeColor: '',
                accessory: '',
                clothing: '',
                background: '',
                mood: '',
                pet: '',
                effect: ''
            },
            lastUpdate: Date.now()
        };
    }

    /**
     * Genera la URL del avatar con parámetros
     */
    generateAvatarURL(avatar = this.currentAvatar) {
        const { name, style, customization } = avatar;
        
        let url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(name)}`;
        
        // Agregar parámetros de personalización
        const params = [];
        
        if (customization.hairColor) params.push(`hairColor=${customization.hairColor}`);
        if (customization.eyeColor) params.push(`eyeColor=${customization.eyeColor}`);
        if (customization.accessory) params.push(`accessories=${customization.accessory}`);
        if (customization.clothing) params.push(`clothing=${customization.clothing}`);
        if (customization.background) params.push(`backgroundColor=${customization.background}`);
        if (customization.mood) params.push(`mouth=${customization.mood}`);
        if (customization.pet) params.push(`backgroundType=particle&backgroundColor=${customization.background}`);
        if (customization.effect) params.push(`backgroundType=gradient&backgroundColor=${customization.background}`);
        
        if (params.length > 0) {
            url += '&' + params.join('&');
        }
        
        return url;
    }

    /**
     * Actualiza el avatar en la interfaz
     */
    updateAvatarInDOM(elementId = 'avatar') {
        const avatarElement = document.getElementById(elementId);
        if (!avatarElement) return;

        const avatarURL = this.generateAvatarURL();
        avatarElement.src = avatarURL;
        avatarElement.alt = `Avatar de ${this.currentAvatar.name}`;
        
        // Agregar clase de evolución si es necesario
        this.checkEvolution();
    }

    /**
     * Verifica si el avatar debe evolucionar
     */
    checkEvolution() {
        const streak = StorageManager.get('rachamuffin_streak', 0);
        const lastAvatarUpdate = StorageManager.get('rachamuffin_lastAvatarUpdate', 0);
        const newLevel = Math.floor(streak / 5);
        const oldLevel = Math.floor(lastAvatarUpdate / 5);

        if (newLevel > oldLevel && streak > 0) {
            this.triggerEvolution(newLevel);
        }
    }

    /**
     * Dispara la animación de evolución
     */
    triggerEvolution(newLevel) {
        if (this.isEvolutionAnimating) return;
        
        this.isEvolutionAnimating = true;
        const avatarElement = document.getElementById('avatar');
        if (!avatarElement) return;

        // Agregar clase de evolución
        avatarElement.classList.add('avatar-evolving');
        
        // Actualizar mensaje
        this.showEvolutionMessage(newLevel);
        
        // Crear partículas de evolución
        this.createEvolutionParticles();
        
        // Actualizar avatar después de la animación
        setTimeout(() => {
            this.updateAvatarInDOM();
            StorageManager.set('rachamuffin_lastAvatarUpdate', StorageManager.get('rachamuffin_streak', 0));
        }, 500);
        
        // Remover clase de evolución
        setTimeout(() => {
            avatarElement.classList.remove('avatar-evolving');
            this.isEvolutionAnimating = false;
        }, 1500);
    }

    /**
     * Muestra mensaje de evolución
     */
    showEvolutionMessage(newLevel) {
        const levelInfo = this.evolutionLevels.find(l => l.level === newLevel) || 
                         this.evolutionLevels[this.evolutionLevels.length - 1];
        
        if (window.notificationSystem) {
            window.notificationSystem.success(
                `¡Tu avatar ha evolucionado a ${levelInfo.name}! 🦸`,
                { duration: 4000 }
            );
        }
    }

    /**
     * Crea partículas de evolución
     */
    createEvolutionParticles() {
        const colors = ['#ff4757', '#ffa502', '#8b5cf6', '#06b6d4', '#ffffff'];
        const container = document.querySelector('.container') || document.body;
        const isMobile = Utils.isMobile();
        const particleCount = isMobile ? 15 : 25;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: ${isMobile ? '6px' : '8px'};
                    height: ${isMobile ? '6px' : '8px'};
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    animation: evolutionParticle 2s ease-out forwards;
                    z-index: 1000;
                    box-shadow: 0 0 10px currentColor;
                `;
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * (isMobile ? 150 : 100));
        }
    }

    /**
     * Personaliza el avatar con nuevos parámetros
     */
    updateAvatar(updates) {
        this.currentAvatar = {
            ...this.currentAvatar,
            ...updates,
            customization: {
                ...this.currentAvatar.customization,
                ...updates.customization
            },
            lastUpdate: Date.now()
        };
        
        this.saveCurrentAvatar();
        this.updateAvatarInDOM();
    }

    /**
     * Guarda el avatar actual
     */
    saveCurrentAvatar() {
        StorageManager.set('rachamuffin_currentAvatar', this.currentAvatar);
    }

    /**
     * Genera avatar aleatorio
     */
    generateRandomAvatar() {
        const hairColors = ['black', 'brown', 'blonde', 'red', 'gray', 'blue', 'green', 'purple', 'pink'];
        const eyeColors = ['brown', 'blue', 'green', 'gray', 'amber'];
        const accessories = ['', 'glasses', 'sunglasses', 'mustache', 'beard', 'earring', 'hat', 'mask'];
        const clothing = ['', 'blazer', 'hoodie', 'sweater', 'collared', 'tank-top', 'dress-shirt'];
        const backgrounds = ['', 'b6e3f4', 'c0aede', 'ffd5dc', 'ffdfbf', 'd1d4f9', 'd8d2db', 'e8dff7'];
        const moods = ['', 'default', 'happy', 'surprised', 'sad', 'angry', 'confident', 'sleepy'];
        const styles = ['adventurer', 'avataaars', 'open-peeps', 'personas', 'micah', 'croodles', 'miniavs'];
        
        const randomAvatar = {
            name: this.currentAvatar.name || 'Hero',
            style: styles[Math.floor(Math.random() * styles.length)],
            customization: {
                hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
                eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
                accessory: accessories[Math.floor(Math.random() * accessories.length)],
                clothing: clothing[Math.floor(Math.random() * clothing.length)],
                background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
                mood: moods[Math.floor(Math.random() * moods.length)],
                pet: '',
                effect: ''
            }
        };
        
        return randomAvatar;
    }

    /**
     * Aplica avatar aleatorio
     */
    applyRandomAvatar() {
        const randomAvatar = this.generateRandomAvatar();
        this.updateAvatar(randomAvatar);
        
        if (window.notificationSystem) {
            window.notificationSystem.success('¡Avatar aleatorio aplicado! 🎲');
        }
    }

    /**
     * Guarda preset de avatar
     */
    savePreset(name, avatar = this.currentAvatar) {
        const preset = {
            id: Utils.generateId(),
            name: name || avatar.name,
            avatar: { ...avatar },
            timestamp: Date.now()
        };
        
        this.presets.push(preset);
        
        // Mantener solo los últimos 10 presets
        if (this.presets.length > 10) {
            this.presets.shift();
        }
        
        this.savePresets();
        
        if (window.notificationSystem) {
            window.notificationSystem.success('¡Preset guardado! ⭐');
        }
        
        return preset.id;
    }

    /**
     * Carga preset de avatar
     */
    loadPreset(presetId) {
        const preset = this.presets.find(p => p.id === presetId);
        if (!preset) {
            if (window.notificationSystem) {
                window.notificationSystem.error('Preset no encontrado');
            }
            return false;
        }
        
        this.updateAvatar(preset.avatar);
        
        if (window.notificationSystem) {
            window.notificationSystem.success(`¡Preset "${preset.name}" cargado! 📁`);
        }
        
        return true;
    }

    /**
     * Obtiene nivel actual del avatar
     */
    getCurrentLevel() {
        const streak = StorageManager.get('rachamuffin_streak', 0);
        return Math.floor(streak / 5);
    }

    /**
     * Obtiene información del nivel actual
     */
    getLevelInfo() {
        const currentLevel = this.getCurrentLevel();
        return this.evolutionLevels.find(l => l.level === currentLevel) || 
               this.evolutionLevels[this.evolutionLevels.length - 1];
    }

    /**
     * Obtiene progreso al siguiente nivel
     */
    getLevelProgress() {
        const streak = StorageManager.get('rachamuffin_streak', 0);
        const currentLevel = Math.floor(streak / 5);
        const nextLevel = this.evolutionLevels.find(l => l.level > currentLevel);
        
        if (!nextLevel) return 100;
        
        const currentLevelMin = currentLevel * 5;
        const nextLevelMin = nextLevel.minStreak;
        const progress = ((streak - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
        
        return Utils.clamp(progress, 0, 100);
    }

    /**
     * Carga presets desde storage
     */
    loadPresets() {
        return StorageManager.get('rachamuffin_avatar_presets', []);
    }

    /**
     * Guarda presets en storage
     */
    savePresets() {
        StorageManager.set('rachamuffin_avatar_presets', this.presets);
    }

    /**
     * Configura estilos CSS adicionales
     */
    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes evolutionParticle {
                0% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(-50% + 100px), calc(-50% - 100px)) scale(0);
                    opacity: 0;
                }
            }

            .avatar-evolving {
                animation: avatarEvolution 1s ease-in-out;
            }

            @keyframes avatarEvolution {
                0% { transform: scale(1) rotateY(0deg); }
                25% { transform: scale(1.2) rotateY(90deg) brightness(2); }
                50% { transform: scale(1.1) rotateY(180deg) brightness(1.5) hue-rotate(90deg); }
                75% { transform: scale(1.2) rotateY(270deg) brightness(2); }
                100% { transform: scale(1) rotateY(360deg) brightness(1); }
            }

            @media (prefers-reduced-motion: reduce) {
                .avatar-evolving {
                    animation: none;
                }
                
                @keyframes evolutionParticle {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Exporta datos del avatar
     */
    exportAvatar() {
        return {
            avatar: this.currentAvatar,
            presets: this.presets,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Importa datos del avatar
     */
    importAvatar(data) {
        if (data.avatar) {
            this.updateAvatar(data.avatar);
        }
        
        if (data.presets && Array.isArray(data.presets)) {
            this.presets = data.presets;
            this.savePresets();
        }
        
        if (window.notificationSystem) {
            window.notificationSystem.success('¡Avatar importado exitosamente!');
        }
    }
}

// Instancia global
window.avatarSystem = new AvatarSystem();