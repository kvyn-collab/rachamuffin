/**
 * 🎮 Sistema de Gamificación Avanzado
 * Manejo de logros, niveles, estadísticas y recompensas
 */

import { Utils, StorageManager } from '../utils/utils.js';

export class GamificationSystem {
    constructor() {
        this.achievements = this.initializeAchievements();
        this.stats = this.loadStats();
        this.dailyChallenges = this.initializeDailyChallenges();
        this.streakHistory = this.loadStreakHistory();
    }

    /**
     * Inicializa el sistema de gamificación
     */
    init() {
        this.setupStyles();
        this.checkDailyChallenges();
        this.updateStatsDisplay();
    }

    /**
     * Define todos los logros disponibles
     */
    initializeAchievements() {
        return [
            // Logros de racha básica
            {
                id: 'first_streak',
                name: 'Primeros Pasos',
                description: 'Completa tu primera misión',
                icon: '🎯',
                category: 'streak',
                condition: (stats) => stats.totalStreaks >= 1,
                reward: { coins: 50, title: 'Novato' }
            },
            {
                id: 'streak_5',
                name: 'Constante',
                description: 'Mantén una racha de 5 días',
                icon: '🔥',
                category: 'streak',
                condition: (stats) => stats.maxStreak >= 5,
                reward: { coins: 100, title: 'Constante' }
            },
            {
                id: 'streak_10',
                name: 'Dedicado',
                description: 'Mantén una racha de 10 días',
                icon: '💪',
                category: 'streak',
                condition: (stats) => stats.maxStreak >= 10,
                reward: { coins: 200, title: 'Dedicado' }
            },
            {
                id: 'streak_25',
                name: 'Héroe',
                description: 'Mantén una racha de 25 días',
                icon: '🦸',
                category: 'streak',
                condition: (stats) => stats.maxStreak >= 25,
                reward: { coins: 500, title: 'Héroe' }
            },
            {
                id: 'streak_50',
                name: 'Leyenda',
                description: 'Mantén una racha de 50 días',
                icon: '👑',
                category: 'streak',
                condition: (stats) => stats.maxStreak >= 50,
                reward: { coins: 1000, title: 'Leyenda' }
            },
            {
                id: 'streak_100',
                name: 'Mítico',
                description: 'Mantén una racha de 100 días',
                icon: '⚡',
                category: 'streak',
                condition: (stats) => stats.maxStreak >= 100,
                reward: { coins: 2000, title: 'Mítico' }
            },

            // Logros de consistencia
            {
                id: 'perfect_week',
                name: 'Semana Perfecta',
                description: 'Completa misiones 7 días seguidos',
                icon: '📅',
                category: 'consistency',
                condition: (stats) => stats.perfectWeeks >= 1,
                reward: { coins: 300, title: 'Perfeccionista' }
            },
            {
                id: 'perfect_month',
                name: 'Mes Perfecto',
                description: 'Completa misiones 30 días seguidos',
                icon: '🌟',
                category: 'consistency',
                condition: (stats) => stats.perfectMonths >= 1,
                reward: { coins: 1500, title: 'Maestro' }
            },

            // Logros deCoins
            {
                id: 'coin_collector',
                name: 'Coleccionista',
                description: 'Acumula 1000 monedas',
                icon: '💰',
                category: 'coins',
                condition: (stats) => stats.totalCoinsEarned >= 1000,
                reward: { coins: 100, title: 'Millonario' }
            },
            {
                id: 'big_spender',
                name: 'Gran Gastador',
                description: 'Gasta 500 monedas en recompensas',
                icon: '🛍️',
                category: 'coins',
                condition: (stats) => stats.totalCoinsSpent >= 500,
                reward: { coins: 50, title: 'Comprador' }
            },

            // Logros especiales
            {
                id: 'comeback_kid',
                name: 'Regreso Triunfal',
                description: 'Récupera tu racha después de romperla',
                icon: '🔄',
                category: 'special',
                condition: (stats) => stats.comebacks >= 1,
                reward: { coins: 200, title: 'Resiliente' }
            },
            {
                id: 'night_owl',
                name: 'Búho Nocturno',
                description: 'Completa una misión después de medianoche',
                icon: '🦉',
                category: 'special',
                condition: (stats) => stats.nightCompletions >= 1,
                reward: { coins: 75, title: 'Nocturno' }
            },
            {
                id: 'early_bird',
                name: 'Madrugador',
                description: 'Completa una misión antes de las 6 AM',
                icon: '🐦',
                category: 'special',
                condition: (stats) => stats.earlyCompletions >= 1,
                reward: { coins: 75, title: 'Madrugador' }
            },

            // Logros de variedad
            {
                id: 'streak_explorer',
                name: 'Explorador',
                description: 'Prueba todos los tipos de rachas',
                icon: '🧭',
                category: 'variety',
                condition: (stats) => stats.streakTypesUsed >= 7,
                reward: { coins: 300, title: 'Explorador' }
            },
            {
                id: 'social_butterfly',
                name: 'Mariposa Social',
                description: 'Comparte tu progreso (próximamente)',
                icon: '🦋',
                category: 'social',
                condition: (stats) => stats.shares >= 1,
                reward: { coins: 100, title: 'Social' }
            }
        ];
    }

    /**
     * Inicializa desafíos diarios
     */
    initializeDailyChallenges() {
        const challenges = [
            {
                id: 'daily_streak',
                name: 'Mantén tu Racha',
                description: 'Completa tu misión diaria',
                icon: '🔥',
                type: 'streak',
                target: 1,
                reward: { coins: 25, exp: 10 }
            },
            {
                id: 'early_bird_daily',
                name: 'Madrugador del Día',
                description: 'Completa tu misión antes de las 9 AM',
                icon: '🌅',
                type: 'time',
                target: 1,
                reward: { coins: 50, exp: 15 }
            },
            {
                id: 'motivational_daily',
                name: 'Motivador',
                description: 'Escribe una nota motivacional',
                icon: '💭',
                type: 'custom',
                target: 1,
                reward: { coins: 30, exp: 12 }
            },
            {
                id: 'perfect_day_daily',
                name: 'Día Perfecto',
                description: 'Completa tu misión y establece una meta para mañana',
                icon: '⭐',
                type: 'combo',
                target: 2,
                reward: { coins: 75, exp: 25 }
            }
        ];

        // Seleccionar 2-3 desafíos aleatorios por día
        const selected = [];
        const shuffled = [...challenges].sort(() => 0.5 - Math.random());
        const count = Math.floor(Math.random() * 2) + 2; // 2-3 desafíos
        
        for (let i = 0; i < count && i < shuffled.length; i++) {
            selected.push({
                ...shuffled[i],
                id: `${shuffled[i].id}_${Utils.dateToISO(new Date())}`,
                completed: false,
                progress: 0,
                date: Utils.dateToISO(new Date())
            });
        }
        
        return selected;
    }

    /**
     * Carga estadísticas del usuario
     */
    loadStats() {
        return StorageManager.get('rachamuffin_gamification_stats', {
            totalStreaks: 0,
            maxStreak: 0,
            totalCoinsEarned: 0,
            totalCoinsSpent: 0,
            perfectWeeks: 0,
            perfectMonths: 0,
            nightCompletions: 0,
            earlyCompletions: 0,
            comebacks: 0,
            streakTypesUsed: 0,
            shares: 0,
            level: 1,
            exp: 0,
            expToNext: 100,
            titles: [],
            achievementsUnlocked: [],
            lastCheckIn: null,
            currentStreak: 0,
            lastMissionTime: null
        });
    }

    /**
     * Carga historial de rachas
     */
    loadStreakHistory() {
        return StorageManager.get('rachamuffin_streak_history', []);
    }

    /**
     * Guarda estadísticas
     */
    saveStats() {
        StorageManager.set('rachamuffin_gamification_stats', this.stats);
    }

    /**
     * Guarda historial de rachas
     */
    saveStreakHistory() {
        StorageManager.set('rachamuffin_streak_history', this.streakHistory);
    }

    /**
     * Registra una misión completada
     */
    recordMissionCompletion() {
        const now = new Date();
        const today = Utils.dateToISO(now);
        
        // Actualizar estadísticas básicas
        this.stats.totalStreaks++;
        this.stats.currentStreak++;
        this.stats.lastCheckIn = now.toISOString();
        this.stats.lastMissionTime = now.toISOString();
        
        // Verificar récords
        if (this.stats.currentStreak > this.stats.maxStreak) {
            this.stats.maxStreak = this.stats.currentStreak;
        }
        
        // Verificar completions tempranas/tardías
        const hour = now.getHours();
        if (hour >= 0 && hour < 6) {
            this.stats.nightCompletions++;
        } else if (hour < 9) {
            this.stats.earlyCompletions++;
        }
        
        // Agregar al historial
        this.streakHistory.push({
            date: today,
            completed: true,
            time: now.toISOString(),
            hour: hour
        });
        
        // Verificar semanas perfectas
        this.checkPerfectWeek();
        
        // Verificar logros
        this.checkAchievements();
        
        // Actualizar nivel
        this.updateLevel();
        
        // Verificar desafíos diarios
        this.checkDailyChallenges();
        
        this.saveStats();
        this.saveStreakHistory();
        
        this.updateStatsDisplay();
    }

    /**
     * Registra racha rota
     */
    recordStreakBreak() {
        const now = new Date();
        const today = Utils.dateToISO(now);
        
        // Si la racha era significativa, contar como comeback potencial
        if (this.stats.currentStreak >= 7) {
            this.stats.comebacks++;
        }
        
        // Resetear racha actual
        this.stats.currentStreak = 0;
        
        // Agregar al historial
        this.streakHistory.push({
            date: today,
            completed: false,
            time: now.toISOString(),
            hour: now.getHours()
        });
        
        this.saveStats();
        this.saveStreakHistory();
        this.updateStatsDisplay();
    }

    /**
     * Verifica semanas perfectas
     */
    checkPerfectWeek() {
        const last7Days = this.streakHistory.slice(-7);
        const allCompleted = last7Days.length === 7 && 
                           last7Days.every(day => day.completed);
        
        if (allCompleted) {
            this.stats.perfectWeeks++;
            
            if (window.notificationSystem) {
                window.notificationSystem.success('¡Semana perfecta completada! 📅', {
                    duration: 5000
                });
            }
        }
    }

    /**
     * Verifica meses perfectos
     */
    checkPerfectMonth() {
        const last30Days = this.streakHistory.slice(-30);
        const allCompleted = last30Days.length === 30 && 
                           last30Days.every(day => day.completed);
        
        if (allCompleted) {
            this.stats.perfectMonths++;
        }
    }

    /**
     * Verifica logros
     */
    checkAchievements() {
        const unlockedAchievements = [];
        
        this.achievements.forEach(achievement => {
            if (!this.stats.achievementsUnlocked.includes(achievement.id) &&
                achievement.condition(this.stats)) {
                
                this.stats.achievementsUnlocked.push(achievement.id);
                unlockedAchievements.push(achievement);
                
                // Otorgar recompensas
                if (achievement.reward.coins) {
                    const currentCoins = StorageManager.get('rachamuffin_coins', 0);
                    StorageManager.set('rachamuffin_coins', currentCoins + achievement.reward.coins);
                    this.stats.totalCoinsEarned += achievement.reward.coins;
                }
                
                if (achievement.reward.title) {
                    this.stats.titles.push(achievement.reward.title);
                }
            }
        });
        
        // Mostrar notificaciones de logros desbloqueados
        unlockedAchievements.forEach(achievement => {
            if (window.notificationSystem) {
                window.notificationSystem.success(
                    `¡Logro desbloqueado! ${achievement.icon} ${achievement.name}`,
                    { duration: 6000 }
                );
            }
        });
        
        if (unlockedAchievements.length > 0) {
            this.saveStats();
        }
    }

    /**
     * Actualiza nivel del usuario
     */
    updateLevel() {
        const newExp = this.stats.exp + 10; // 10 EXP por misión
        this.stats.exp = newExp;
        
        while (this.stats.exp >= this.stats.expToNext) {
            this.stats.exp -= this.stats.expToNext;
            this.stats.level++;
            this.stats.expToNext = Math.floor(this.stats.expToNext * 1.2); // Incremento exponencial
            
            // Notificación de subida de nivel
            if (window.notificationSystem) {
                window.notificationSystem.success(
                    `¡Subiste a nivel ${this.stats.level}! 🎉`,
                    { duration: 4000 }
                );
            }
        }
    }

    /**
     * Verifica desafíos diarios
     */
    checkDailyChallenges() {
        const today = Utils.dateToISO(new Date());
        const savedChallenges = StorageManager.get('rachamuffin_daily_challenges', []);
        
        // Si no hay desafíos para hoy, crear nuevos
        if (savedChallenges.length === 0 || 
            !savedChallenges[0] || 
            savedChallenges[0].date !== today) {
            
            const newChallenges = this.initializeDailyChallenges();
            StorageManager.set('rachamuffin_daily_challenges', newChallenges);
            return newChallenges;
        }
        
        return savedChallenges;
    }

    /**
     * Actualiza progreso de desafíos
     */
    updateChallengeProgress(challengeId, increment = 1) {
        const challenges = StorageManager.get('rachamuffin_daily_challenges', []);
        const challenge = challenges.find(c => c.id === challengeId);
        
        if (challenge && !challenge.completed) {
            challenge.progress += increment;
            
            if (challenge.progress >= challenge.target) {
                challenge.completed = true;
                
                // Otorgar recompensas
                if (challenge.reward.coins) {
                    const currentCoins = StorageManager.get('rachamuffin_coins', 0);
                    StorageManager.set('rachamuffin_coins', currentCoins + challenge.reward.coins);
                    this.stats.totalCoinsEarned += challenge.reward.coins;
                }
                
                this.stats.exp += challenge.reward.exp;
                
                if (window.notificationSystem) {
                    window.notificationSystem.success(
                        `¡Desafío completado! ${challenge.icon} ${challenge.name}`,
                        { duration: 4000 }
                    );
                }
            }
            
            StorageManager.set('rachamuffin_daily_challenges', challenges);
            this.saveStats();
        }
    }

    /**
     * Obtiene estadísticas para mostrar
     */
    getDisplayStats() {
        return {
            level: this.stats.level,
            exp: this.stats.exp,
            expToNext: this.stats.expToNext,
            progress: (this.stats.exp / this.stats.expToNext) * 100,
            currentStreak: this.stats.currentStreak,
            maxStreak: this.stats.maxStreak,
            totalStreaks: this.stats.totalStreaks,
            titles: this.stats.titles,
            achievements: this.stats.achievementsUnlocked.length,
            challenges: this.checkDailyChallenges()
        };
    }

    /**
     * Actualiza la visualización de estadísticas
     */
    updateStatsDisplay() {
        const stats = this.getDisplayStats();
        
        // Actualizar elementos de la interfaz si existen
        const elements = {
            level: document.getElementById('userLevel'),
            exp: document.getElementById('expProgress'),
            streak: document.getElementById('streak'),
            maxStreak: document.getElementById('maxStreak')
        };
        
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                elements[key].textContent = stats[key];
            }
        });
        
        // Actualizar barra de experiencia
        const expBar = document.getElementById('expBar');
        if (expBar) {
            expBar.style.width = `${stats.progress}%`;
        }
    }

    /**
     * Configura estilos CSS
     */
    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .achievement-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(145deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95));
                color: white;
                padding: 2rem;
                border-radius: 20px;
                border: 3px solid;
                border-image: linear-gradient(45deg, var(--primary), var(--gold)) 1;
                box-shadow: 0 0 50px rgba(255, 71, 87, 0.5);
                z-index: 10001;
                text-align: center;
                animation: achievementPopup 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 400px;
                backdrop-filter: blur(15px);
            }

            .achievement-popup .icon {
                font-size: 4rem;
                margin-bottom: 1rem;
                animation: achievementBounce 0.6s ease-out;
            }

            .achievement-popup .title {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
                background: linear-gradient(45deg, var(--primary), var(--gold));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .achievement-popup .description {
                font-size: 1rem;
                opacity: 0.9;
                margin-bottom: 1rem;
            }

            .achievement-popup .reward {
                color: var(--gold);
                font-weight: bold;
            }

            @keyframes achievementPopup {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            @keyframes achievementBounce {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin: 1rem 0;
            }

            .stat-card {
                background: linear-gradient(145deg, rgba(255, 71, 87, 0.1), rgba(255, 165, 2, 0.1));
                border: 2px solid rgba(255, 71, 87, 0.3);
                border-radius: 15px;
                padding: 1rem;
                text-align: center;
                transition: all 0.3s ease;
            }

            .stat-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(255, 71, 87, 0.3);
                border-color: var(--primary);
            }

            .exp-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin: 0.5rem 0;
            }

            .exp-progress {
                height: 100%;
                background: linear-gradient(90deg, var(--primary), var(--gold));
                transition: width 0.3s ease;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Exporta datos de gamificación
     */
    exportGamificationData() {
        return {
            stats: this.stats,
            achievements: this.achievements,
            streakHistory: this.streakHistory,
            dailyChallenges: this.checkDailyChallenges(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Importa datos de gamificación
     */
    importGamificationData(data) {
        if (data.stats) {
            this.stats = { ...this.stats, ...data.stats };
        }
        
        if (data.streakHistory) {
            this.streakHistory = data.streakHistory;
        }
        
        this.saveStats();
        this.saveStreakHistory();
        this.updateStatsDisplay();
        
        if (window.notificationSystem) {
            window.notificationSystem.success('¡Datos de gamificación importados!');
        }
    }
}

// Instancia global
window.gamificationSystem = new GamificationSystem();