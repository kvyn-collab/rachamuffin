/**
 * 🔔 Sistema de Notificaciones Mejorado
 * Manejo elegante de notificaciones al usuario
 */

import { Utils } from '../utils/utils.js';

export class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.maxNotifications = 5;
        this.init();
    }

    init() {
        this.createContainer();
        this.setupStyles();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-label', 'Notificaciones');
        document.body.appendChild(this.container);
    }

    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
                max-width: 350px;
            }

            .notification {
                pointer-events: auto;
                background: linear-gradient(145deg, rgba(0, 0, 0, 0.9), rgba(26, 26, 26, 0.95));
                color: white;
                padding: 1rem 1.5rem;
                margin-bottom: 10px;
                border-radius: 15px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                border: 2px solid;
                animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                position: relative;
                overflow: hidden;
                will-change: transform, opacity;
            }

            .notification::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: notificationShine 2s ease-in-out infinite;
            }

            .notification.success {
                border-color: var(--success, #2ed573);
                box-shadow: 0 4px 20px rgba(46, 213, 115, 0.3);
            }

            .notification.warning {
                border-color: var(--warning, #ffa502);
                box-shadow: 0 4px 20px rgba(255, 165, 2, 0.3);
            }

            .notification.error {
                border-color: var(--primary, #ff4757);
                box-shadow: 0 4px 20px rgba(255, 71, 87, 0.3);
            }

            .notification.info {
                border-color: var(--cyan, #06b6d4);
                box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                position: relative;
                z-index: 1;
            }

            .notification-icon {
                font-size: 1.2rem;
                flex-shrink: 0;
            }

            .notification-message {
                flex: 1;
                font-weight: 500;
                line-height: 1.4;
            }

            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.7;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .notification-close:hover {
                opacity: 1;
                background: rgba(255,255,255,0.1);
            }

            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: currentColor;
                animation: notificationProgress linear forwards;
                opacity: 0.6;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            @keyframes notificationShine {
                0% { left: -100%; }
                50% { left: 100%; }
                100% { left: 100%; }
            }

            @keyframes notificationProgress {
                from { width: 100%; }
                to { width: 0%; }
            }

            @media (max-width: 768px) {
                #notification-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
                
                .notification {
                    margin-bottom: 8px;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .notification,
                .notification::before,
                .notification-progress {
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    show(message, type = 'info', options = {}) {
        const {
            duration = 4000,
            persistent = false,
            actions = [],
            onClick = null,
            icon = null
        } = options;

        // Limitar número de notificaciones
        if (this.notifications.size >= this.maxNotifications) {
            this.removeOldest();
        }

        const id = Utils.generateId();
        const notification = this.createNotificationElement(id, message, type, icon, actions, onClick);
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Animación de entrada
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-remove si no es persistente
        if (!persistent && duration > 0) {
            setTimeout(() => {
                this.hide(id);
            }, duration);
        }

        // Agregar barra de progreso si hay duración
        if (!persistent && duration > 0) {
            const progressBar = document.createElement('div');
            progressBar.className = 'notification-progress';
            progressBar.style.animationDuration = `${duration}ms`;
            notification.appendChild(progressBar);
        }

        return id;
    }

    createNotificationElement(id, message, type, icon, actions, onClick) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.dataset.id = id;

        const iconMap = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };

        const finalIcon = icon || iconMap[type] || 'ℹ️';

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${finalIcon}</div>
                <div class="notification-message">${Utils.sanitizeInput(message)}</div>
                <button class="notification-close" aria-label="Cerrar notificación" onclick="window.notificationSystem.hide('${id}')">
                    ✕
                </button>
            </div>
        `;

        // Agregar acciones si existen
        if (actions.length > 0) {
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'notification-actions';
            actionsContainer.style.cssText = `
                margin-top: 0.5rem;
                display: flex;
                gap: 0.5rem;
                justify-content: flex-end;
            `;

            actions.forEach(action => {
                const button = document.createElement('button');
                button.textContent = action.label;
                button.style.cssText = `
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: inherit;
                    padding: 0.25rem 0.75rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                `;
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    action.callback();
                });
                actionsContainer.appendChild(button);
            });

            notification.appendChild(actionsContainer);
        }

        // Click handler
        if (onClick) {
            notification.style.cursor = 'pointer';
            notification.addEventListener('click', onClick);
        }

        return notification;
    }

    hide(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }

    removeOldest() {
        const oldestId = this.notifications.keys().next().value;
        this.hide(oldestId);
    }

    clear() {
        this.notifications.forEach((notification, id) => {
            this.hide(id);
        });
    }

    // Métodos de conveniencia
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', { ...options, duration: 6000 });
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    // Notificación de confirmación con acciones
    confirm(message, onConfirm, onCancel = null) {
        return this.show(message, 'warning', {
            persistent: true,
            actions: [
                {
                    label: 'Confirmar',
                    callback: () => {
                        onConfirm();
                        this.clear();
                    }
                },
                {
                    label: 'Cancelar',
                    callback: () => {
                        if (onCancel) onCancel();
                        this.clear();
                    }
                }
            ]
        });
    }

    // Notificación de progreso
    progress(message, progress = 0) {
        const id = this.show(message, 'info', { 
            persistent: true,
            icon: '⏳'
        });

        // Simular progreso (esto se puede actualizar externamente)
        setTimeout(() => {
            if (this.notifications.has(id)) {
                this.hide(id);
            }
        }, 2000);

        return id;
    }
}

// Instancia global
window.notificationSystem = new NotificationSystem();