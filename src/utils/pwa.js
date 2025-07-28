// PWA utilities for service worker registration and app installation
import { useState, useEffect } from 'react';

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isInstallable = false;
    
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.handleInstallPrompt();
    this.checkIfInstalled();
  }

  // Register service worker
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is available
                this.showUpdateNotification();
              }
            });
          }
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('Message from SW:', event.data);
        });

        return registration;
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    } else {
      console.log('Service Worker not supported');
    }
  }

  // Handle app installation prompt
  handleInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('📱 App install prompt available');
      event.preventDefault();
      this.deferredPrompt = event;
      this.isInstallable = true;
      this.showInstallButton();
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      console.log('✅ App installed successfully');
      this.isInstalled = true;
      this.isInstallable = false;
      this.hideInstallButton();
      this.showInstallSuccessMessage();
    });
  }

  // Check if app is already installed
  checkIfInstalled() {
    // Check if running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('📱 App is running in standalone mode');
    }

    // Check for iOS standalone mode
    if (window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('📱 App is running in iOS standalone mode');
    }
  }

  // Trigger app installation
  async installApp() {
    if (!this.deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const result = await this.deferredPrompt.userChoice;
      
      console.log('Install prompt result:', result.outcome);
      
      if (result.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('❌ User dismissed the install prompt');
      }

      this.deferredPrompt = null;
      this.isInstallable = false;
      
      return result.outcome === 'accepted';
    } catch (error) {
      console.error('Error during app installation:', error);
      return false;
    }
  }

  // Show install button
  showInstallButton() {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'block';
      installButton.addEventListener('click', () => {
        this.installApp();
      });
    }
  }

  // Hide install button
  hideInstallButton() {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
  }

  // Show update notification
  showUpdateNotification() {
    // Create update notification
    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f97316;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 300px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="font-weight: 600; margin-bottom: 8px;">
          🆕 Update Available
        </div>
        <div style="font-size: 14px; margin-bottom: 12px;">
          A new version of TeleKiosk is available.
        </div>
        <button 
          id="pwa-update-button"
          style="
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 8px;
            font-size: 14px;
          "
        >
          Update Now
        </button>
        <button 
          id="pwa-update-dismiss"
          style="
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          "
        >
          Later
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Handle update button click
    document.getElementById('pwa-update-button').addEventListener('click', () => {
      this.updateApp();
    });

    // Handle dismiss button click
    document.getElementById('pwa-update-dismiss').addEventListener('click', () => {
      notification.remove();
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  // Update the app
  async updateApp() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }

  // Show install success message
  showInstallSuccessMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 300px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="font-weight: 600; margin-bottom: 8px;">
          ✅ App Installed!
        </div>
        <div style="font-size: 14px;">
          TeleKiosk has been added to your home screen.
        </div>
      </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 5000);
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission === 'granted';
    }
    return false;
  }

  // Show notification
  showNotification(title, options = {}) {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          ...options
        });
      });
    }
  }

  // Check if app is online
  isOnline() {
    return navigator.onLine;
  }

  // Get installation status
  getInstallationStatus() {
    return {
      isInstalled: this.isInstalled,
      isInstallable: this.isInstallable,
      canInstall: this.isInstallable && !this.isInstalled
    };
  }
}

// Create global PWA manager instance
export const pwaManager = new PWAManager();

// Export utilities
export const installApp = () => pwaManager.installApp();
export const getInstallationStatus = () => pwaManager.getInstallationStatus();
export const requestNotificationPermission = () => pwaManager.requestNotificationPermission();
export const showNotification = (title, options) => pwaManager.showNotification(title, options);
export const isOnline = () => pwaManager.isOnline();

// React hook for PWA functionality
export function usePWA() {
  const [installationStatus, setInstallationStatus] = useState(pwaManager.getInstallationStatus());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateStatus = () => {
      setInstallationStatus(pwaManager.getInstallationStatus());
    };

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('beforeinstallprompt', updateStatus);
    window.addEventListener('appinstalled', updateStatus);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('beforeinstallprompt', updateStatus);
      window.removeEventListener('appinstalled', updateStatus);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return {
    ...installationStatus,
    isOnline,
    installApp: pwaManager.installApp.bind(pwaManager),
    requestNotificationPermission: pwaManager.requestNotificationPermission.bind(pwaManager),
    showNotification: pwaManager.showNotification.bind(pwaManager)
  };
}