// Progressive Web App functionality
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.handleInstallPrompt();
        this.handleOfflineStatus();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js');
                console.log('Service Worker registered successfully:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.showUpdateAvailable();
                            }
                        });
                    }
                });
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    handleInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallButton();
            this.deferredPrompt = null;
        });

        // Handle install button click
        const installButton = document.getElementById('installPWA');
        if (installButton) {
            installButton.addEventListener('click', () => {
                this.promptInstall();
            });
        }
    }

    showInstallButton() {
        const installButton = document.getElementById('installPWA');
        if (installButton) {
            installButton.classList.remove('hidden');
        }
    }

    hideInstallButton() {
        const installButton = document.getElementById('installPWA');
        if (installButton) {
            installButton.classList.add('hidden');
        }
    }

    async promptInstall() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            this.deferredPrompt = null;
            this.hideInstallButton();
        }
    }

    handleOfflineStatus() {
        window.addEventListener('online', () => {
            this.hideOfflineMessage();
        });

        window.addEventListener('offline', () => {
            this.showOfflineMessage();
        });
    }

    showOfflineMessage() {
        let offlineMessage = document.getElementById('offlineMessage');
        if (!offlineMessage) {
            offlineMessage = document.createElement('div');
            offlineMessage.id = 'offlineMessage';
            offlineMessage.className = 'offline-message';
            offlineMessage.innerHTML = `
                <div class="offline-content">
                    <span>📡 You're offline</span>
                    <small>Some features may be limited</small>
                </div>
            `;
            
            // Add styles
            offlineMessage.style.cssText = `
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #f59e0b;
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                font-size: 0.9rem;
                animation: slideDown 0.3s ease-out;
            `;
            
            document.body.appendChild(offlineMessage);
        }
        offlineMessage.style.display = 'block';
    }

    hideOfflineMessage() {
        const offlineMessage = document.getElementById('offlineMessage');
        if (offlineMessage) {
            offlineMessage.style.display = 'none';
        }
    }

    showUpdateAvailable() {
        let updateMessage = document.getElementById('updateMessage');
        if (!updateMessage) {
            updateMessage = document.createElement('div');
            updateMessage.id = 'updateMessage';
            updateMessage.className = 'update-message';
            updateMessage.innerHTML = `
                <div class="update-content">
                    <span>🔄 Update available</span>
                    <button id="updateBtn" class="update-btn">Update</button>
                    <button id="dismissUpdate" class="dismiss-btn">×</button>
                </div>
            `;
            
            // Add styles
            updateMessage.style.cssText = `
                position: fixed;
                top: 80px;
                right: 1rem;
                background-color: #10b981;
                color: white;
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                font-size: 0.9rem;
                animation: slideInRight 0.3s ease-out;
            `;
            
            document.body.appendChild(updateMessage);
            
            // Handle update button click
            document.getElementById('updateBtn').addEventListener('click', () => {
                this.applyUpdate();
            });
            
            // Handle dismiss button click
            document.getElementById('dismissUpdate').addEventListener('click', () => {
                updateMessage.style.display = 'none';
            });
        }
        updateMessage.style.display = 'block';
    }

    async applyUpdate() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                
                // Listen for controlling service worker change
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    window.location.reload();
                });
            }
        }
    }

    // Utility method to check if app is installed
    isInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    // Utility method to check if device supports installation
    canInstall() {
        return this.deferredPrompt !== null;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
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
    
    .update-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .update-btn {
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0.25rem 0.75rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background-color 0.2s;
    }
    
    .update-btn:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }
    
    .dismiss-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1.2rem;
        line-height: 1;
        padding: 0;
        margin-left: 0.25rem;
        opacity: 0.8;
    }
    
    .dismiss-btn:hover {
        opacity: 1;
    }
    
    .offline-content {
        text-align: center;
    }
    
    .offline-content small {
        display: block;
        margin-top: 0.25rem;
        opacity: 0.9;
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style);

// Make PWAManager available globally
window.PWAManager = PWAManager;