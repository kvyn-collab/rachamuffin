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
            style: 'thumbs',
            seed: 'Lucky',
            customization: {
                hairColor: 'brown',
                eyeColor: 'blue',
                accessory: '',
                clothing: 'shirt',
                background: 'ffd5dc',
                mood: 'smile',
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
        
        // Parámetros adicionales para mejor calidad
        params.push('size=256');
        params.push('backgroundType=solid');
        
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
        
        // Aplicar clase de nivel según el progreso
        const currentLevel = this.getCurrentLevel();
        const container = avatarElement.closest('.container') || document.body;
        container.classList.remove('avatar-level-0', 'avatar-level-1', 'avatar-level-2', 'avatar-level-3', 'avatar-level-4', 'avatar-level-5', 'avatar-level-10');
        
        if (currentLevel >= 10) {
            container.classList.add('avatar-level-10');
        } else if (currentLevel >= 5) {
            container.classList.add('avatar-level-5');
        } else {
            container.classList.add(`avatar-level-${currentLevel}`);
        }
        
        // Aplicar efecto especial si existe
        if (this.currentAvatar.customization.effect) {
            avatarElement.setAttribute('data-effect', this.currentAvatar.customization.effect);
        } else {
            avatarElement.removeAttribute('data-effect');
        }
        
        // Crear marco del avatar si no existe
        this.ensureAvatarFrame(avatarElement);
        
        // Agregar clase de evolución si es necesario
        this.checkEvolution();
    }

    /**
     * Asegura que el marco del avatar existe
     */
    ensureAvatarFrame(avatarElement) {
        const container = avatarElement.parentElement;
        if (!container) return;
        
        if (!container.classList.contains('avatar-container')) {
            container.classList.add('avatar-container');
            
            // Crear marco decorativo
            const frame = document.createElement('div');
            frame.className = 'avatar-frame';
            container.appendChild(frame);
            
            // Reorganizar elementos
            container.appendChild(avatarElement);
        }
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
        
        // Iconos modernos según el nivel
        const levelIcons = {
            0: '🎆',
            1: '🌟',
            2: '🚀',
            3: '⚡',
            4: '🔥',
            5: '👑',
            6: '🏆',
            7: '🌈',
            8: '✨',
            9: '🌌',
            10: '🎆'
        };
        
        const icon = levelIcons[newLevel] || '🎆';
        
        if (window.notificationSystem) {
            const messages = {
                0: `¡Bienvenido al camino del héroe! ${icon} ${levelInfo.name}`,
                1: `¡Primera evolución! ${icon} Tu avatar ha subido a ${levelInfo.name}`,
                2: `¡Ascensión conseguida! ${icon} Ahora eres ${levelInfo.name}`,
                3: `¡Poder desbloqueado! ${icon} Has alcanzado el nivel ${levelInfo.name}`,
                4: `¡Leyenda en camino! ${icon} Tu avatar evoluciona a ${levelInfo.name}`,
                5: `¡Corona alcanzada! ${icon} ¡Eres oficialmente un ${levelInfo.name}!`,
                6: `¡Maestría conseguida! ${icon} ${levelInfo.name} - ¡Nivel impresionante!`,
                7: `¡Épico activado! ${icon} Tu avatar brilla como ${levelInfo.name}`,
                8: `¡Leyendario logrado! ${icon} ${levelInfo.name} - ¡Leyenda viva!`,
                9: `¡Mítico alcanzado! ${icon} ¡Eres ${levelInfo.name}!`,
                10: `¡Divino conseguido! ${icon} ${levelInfo.name} - ¡Más allá de lo posible!`
            };
            
            const message = messages[newLevel] || `¡Tu avatar ha evolucionado a ${levelInfo.name}! ${icon}`;
            
            window.notificationSystem.success(message, {
                duration: 5000,
                showProgress: true
            });
        }
    }

    /**
     * Crea partículas de evolución
     */
    createEvolutionParticles() {
        const colors = ['#ff4757', '#ffa502', '#8b5cf6', '#06b6d4', '#ffffff', '#ff6b7a', '#a29bfe', '#fd79a8'];
        const container = document.querySelector('.container') || document.body;
        const isMobile = Utils.isMobile();
        const particleCount = isMobile ? 20 : 35;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const size = isMobile ? (6 + Math.random() * 8) : (8 + Math.random() * 12);
                const color = colors[Math.floor(Math.random() * colors.length)];
                const angle = (Math.random() * 360) * Math.PI / 180;
                const distance = 50 + Math.random() * 100;
                
                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    pointer-events: none;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    animation: evolutionParticle 2.5s ease-out forwards;
                    z-index: 1000;
                    box-shadow: 0 0 ${size}px ${color};
                    filter: brightness(1.2);
                `;
                
                // Agregar movimiento aleatorio
                const finalX = Math.cos(angle) * distance;
                const finalY = Math.sin(angle) * distance;
                particle.style.animation = `evolutionParticle 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
                particle.style.setProperty('--final-x', `${finalX}px`);
                particle.style.setProperty('--final-y', `${finalY}px`);
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2500);
            }, i * (isMobile ? 80 : 60));
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
        // Colores de cabello modernos y atractivos
        const hairColors = ['auburn', 'black', 'blonde', 'brown', 'dark', 'platinum', 'red', 'ginger', 'silver', 'navy', 'teal', 'purple', 'pink', 'blue', 'green'];
        
        // Colores de ojos más variados
        const eyeColors = ['amber', 'blue', 'brown', 'gray', 'green', 'hazel', 'dark', 'violet'];
        
        // Accesorios más modernos
        const accessories = ['', 'glasses', 'sunglasses', 'mustache', 'beard', 'earring', 'hat', 'mask', 'noseRing', 'headphones', 'cap'];
        
        // Ropa más moderna
        const clothing = ['', 'hoodie', 'blazer', 'sweater', 'collared', 'tank-top', 'dress-shirt', 't-shirt', 'jacket', 'cardigan'];
        
        // Fondos modernos y vibrantes
        const backgrounds = ['ffd5dc', 'ffdfbf', 'd1d4f9', 'c0aede', 'b6e3f4', 'd8d2db', 'e8dff7', 'ffeaa7', 'fab1a0', 'fd79a8', '6c5ce7', 'a29bfe'];
        
        // Expresiones más naturales
        const moods = ['default', 'happy', 'smile', 'surprised', 'serious', 'calm', 'focused', 'confident'];
        
        // Estilos más modernos y atractivos
        const styles = ['thumbs', 'avataaars', 'bottts', 'pixel-art', 'lorelei', 'notionists', 'shapes', 'big-ears', 'croodles'];
        
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
     * Genera avatar predefinido moderno
     */
    generateModernAvatarPreset(styleName) {
        const modernPresets = {
            'cyberpunk': {
                name: 'Cyberpunk',
                style: 'bottts',
                customization: {
                    hairColor: 'teal',
                    eyeColor: 'blue',
                    accessory: 'sunglasses',
                    clothing: 'jacket',
                    background: '6c5ce7',
                    mood: 'serious',
                    effect: 'neon'
                }
            },
            'elegant': {
                name: 'Elegante',
                style: 'avataaars',
                customization: {
                    hairColor: 'brown',
                    eyeColor: 'hazel',
                    accessory: 'glasses',
                    clothing: 'blazer',
                    background: 'ffd5dc',
                    mood: 'smile',
                    effect: 'classic'
                }
            },
            'adventurer': {
                name: 'Aventurero',
                style: 'lorelei',
                customization: {
                    hairColor: 'red',
                    eyeColor: 'green',
                    accessory: 'hat',
                    clothing: 'hoodie',
                    background: 'b6e3f4',
                    mood: 'confident',
                    effect: 'outdoor'
                }
            },
            'minimalist': {
                name: 'Minimalista',
                style: 'shapes',
                customization: {
                    hairColor: 'black',
                    eyeColor: 'dark',
                    accessory: '',
                    clothing: 't-shirt',
                    background: 'd8d2db',
                    mood: 'calm',
                    effect: 'clean'
                }
            },
            'fantasy': {
                name: 'Fantasia',
                style: 'notionists',
                customization: {
                    hairColor: 'purple',
                    eyeColor: 'violet',
                    accessory: 'earring',
                    clothing: 'dress-shirt',
                    background: 'a29bfe',
                    mood: 'focused',
                    effect: 'magical'
                }
            },
            'retro': {
                name: 'Retro',
                style: 'big-ears',
                customization: {
                    hairColor: 'ginger',
                    eyeColor: 'amber',
                    accessory: 'mustache',
                    clothing: 'sweater',
                    background: 'ffdfbf',
                    mood: 'happy',
                    effect: 'vintage'
                }
            },
            'modern': {
                name: 'Moderno',
                style: 'thumbs',
                customization: {
                    hairColor: 'platinum',
                    eyeColor: 'gray',
                    accessory: 'headphones',
                    clothing: 'cardigan',
                    background: 'd1d4f9',
                    mood: 'focused',
                    effect: 'contemporary'
                }
            }
        };
        
        return modernPresets[styleName] || modernPresets['modern'];
    }

    /**
     * Aplica avatar predefinido moderno
     */
    applyModernPreset(styleName) {
        const preset = this.generateModernAvatarPreset(styleName);
        this.updateAvatar({
            name: this.currentAvatar.name,
            ...preset
        });
        
        if (window.notificationSystem) {
            window.notificationSystem.success(
                `¡Estilo "${preset.name}" aplicado! ✨`,
                { duration: 4000 }
            );
        }
    }

    /**
     * Obtiene lista de presets modernos disponibles
     */
    getModernPresets() {
        return [
            { id: 'cyberpunk', name: 'Cyberpunk', icon: '🕶️', description: 'Futurista y tecnológico' },
            { id: 'elegant', name: 'Elegante', icon: '✨', description: 'Sofisticado y pulido' },
            { id: 'adventurer', name: 'Aventurero', icon: '🗺️', description: 'Explorador y valiente' },
            { id: 'minimalist', name: 'Minimalista', icon: '⚪', description: 'Limpio y simple' },
            { id: 'fantasy', name: 'Fantasia', icon: '✨', description: 'Mágico y místico' },
            { id: 'retro', name: 'Retro', icon: '🎨', description: 'Vintage y nostálgico' },
            { id: 'modern', name: 'Moderno', icon: '📱', description: 'Contemporáneo y fresco' }
        ];
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
                25% {
                    transform: translate(calc(-50% + var(--final-x, 50px) * 0.25), calc(-50% + var(--final-y, -50px) * 0.25)) scale(1.5);
                    opacity: 0.9;
                }
                50% {
                    transform: translate(calc(-50% + var(--final-x, 50px) * 0.5), calc(-50% + var(--final-y, -50px) * 0.5)) scale(2);
                    opacity: 0.7;
                }
                75% {
                    transform: translate(calc(-50% + var(--final-x, 50px) * 0.75), calc(-50% + var(--final-y, -50px) * 0.75)) scale(1.2);
                    opacity: 0.4;
                }
                100% {
                    transform: translate(calc(-50% + var(--final-x, 50px)), calc(-50% + var(--final-y, -50px))) scale(0.3);
                    opacity: 0;
                }
            }

            .avatar-evolving {
                animation: avatarEvolution 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                filter: drop-shadow(0 0 20px rgba(255, 71, 87, 0.8));
            }

            @keyframes avatarEvolution {
                0% { 
                    transform: scale(1) rotateY(0deg); 
                    filter: brightness(1) contrast(1);
                }
                20% { 
                    transform: scale(1.3) rotateY(90deg) brightness(1.5) contrast(1.2); 
                    filter: drop-shadow(0 0 30px rgba(255, 71, 87, 0.9));
                }
                40% { 
                    transform: scale(1.1) rotateY(180deg) brightness(2) contrast(1.4) hue-rotate(90deg); 
                    filter: drop-shadow(0 0 40px rgba(255, 165, 2, 1));
                }
                60% { 
                    transform: scale(1.2) rotateY(270deg) brightness(1.8) contrast(1.3) hue-rotate(180deg); 
                    filter: drop-shadow(0 0 35px rgba(139, 92, 246, 0.9));
                }
                80% { 
                    transform: scale(1.1) rotateY(330deg) brightness(1.4) contrast(1.1) hue-rotate(270deg); 
                    filter: drop-shadow(0 0 25px rgba(6, 182, 212, 0.8));
                }
                100% { 
                    transform: scale(1) rotateY(360deg) brightness(1) contrast(1); 
                    filter: drop-shadow(0 0 20px rgba(255, 71, 87, 0.6));
                }
            }

            /* Estilos para avatares mejorados */
            #avatar {
                border-radius: 20px;
                border: 3px solid transparent;
                background: linear-gradient(45deg, rgba(255, 71, 87, 0.3), rgba(255, 165, 2, 0.3));
                padding: 4px;
                transition: all 0.3s ease;
            }

            #avatar:hover {
                transform: scale(1.05);
                border-color: rgba(255, 71, 87, 0.6);
                box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
            }

            /* Efectos especiales para niveles altos */
            .avatar-level-5 #avatar {
                animation: avatarGlow 3s ease-in-out infinite alternate;
            }

            @keyframes avatarGlow {
                0% { filter: drop-shadow(0 0 10px rgba(255, 71, 87, 0.5)); }
                100% { filter: drop-shadow(0 0 20px rgba(255, 165, 2, 0.8)); }
            }

            .avatar-level-10 #avatar {
                animation: avatarEpicGlow 2s ease-in-out infinite;
            }

            @keyframes avatarEpicGlow {
                0%, 100% { filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6)) hue-rotate(0deg); }
                25% { filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.8)) hue-rotate(90deg); }
                50% { filter: drop-shadow(0 0 25px rgba(255, 165, 2, 0.9)) hue-rotate(180deg); }
                75% { filter: drop-shadow(0 0 20px rgba(255, 71, 87, 0.7)) hue-rotate(270deg); }
            }

            /* Efectos especiales para avatares */
            [data-effect="neon"] #avatar {
                filter: drop-shadow(0 0 10px #00ffff) drop-shadow(0 0 20px #ff00ff);
                animation: neonPulse 2s ease-in-out infinite alternate;
            }

            @keyframes neonPulse {
                0% { filter: drop-shadow(0 0 5px #00ffff) drop-shadow(0 0 10px #ff00ff); }
                100% { filter: drop-shadow(0 0 15px #00ffff) drop-shadow(0 0 25px #ff00ff); }
            }

            [data-effect="magical"] #avatar {
                filter: drop-shadow(0 0 15px #a29bfe) saturate(1.3);
                animation: magicalSparkle 3s ease-in-out infinite;
            }

            @keyframes magicalSparkle {
                0%, 100% { filter: drop-shadow(0 0 10px #a29bfe) saturate(1.2); }
                50% { filter: drop-shadow(0 0 20px #fd79a8) saturate(1.5) hue-rotate(180deg); }
            }

            [data-effect="vintage"] #avatar {
                filter: sepia(0.3) contrast(1.2) brightness(0.9);
                border: 3px solid rgba(139, 69, 19, 0.6);
            }

            [data-effect="contemporary"] #avatar {
                filter: contrast(1.1) saturate(1.1) drop-shadow(0 2px 8px rgba(0,0,0,0.2));
                border-radius: 12px;
            }

            /* Botones de estilos modernos */
            .preset-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin: 1rem 0;
                justify-content: center;
            }

            .preset-button {
                padding: 0.5rem 1rem;
                border: 2px solid var(--primary);
                background: transparent;
                color: var(--primary);
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .preset-button:hover {
                background: var(--primary);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
            }

            .preset-button:active {
                transform: translateY(0);
            }

            /* Mejoras visuales generales */
            .avatar-container {
                position: relative;
                display: inline-block;
                margin: 1rem 0;
            }

            .avatar-frame {
                position: absolute;
                top: -8px;
                left: -8px;
                right: -8px;
                bottom: -8px;
                border: 2px solid transparent;
                border-radius: 25px;
                pointer-events: none;
                transition: all 0.3s ease;
            }

            .avatar-level-5 .avatar-frame {
                border-color: rgba(255, 165, 2, 0.6);
                animation: frameGlow 2s ease-in-out infinite alternate;
            }

            .avatar-level-10 .avatar-frame {
                border-color: rgba(139, 92, 246, 0.8);
                animation: epicFrameGlow 1.5s ease-in-out infinite;
            }

            @keyframes frameGlow {
                0% { box-shadow: 0 0 10px rgba(255, 165, 2, 0.3); }
                100% { box-shadow: 0 0 20px rgba(255, 165, 2, 0.6); }
            }

            @keyframes epicFrameGlow {
                0%, 100% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.4); }
                50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.7); }
            }

            @media (prefers-reduced-motion: reduce) {
                .avatar-evolving {
                    animation: none;
                }
                
                @keyframes evolutionParticle {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }

                #avatar:hover {
                    transform: none;
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