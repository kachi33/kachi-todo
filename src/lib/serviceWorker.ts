/**
 * Service Worker Registration Utility
 * Handles registration, updates, and communication with the service worker
 */

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  // Only register in production and if service workers are supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported');
    return null;
  }

  try {
    console.log('[SW] Registering service worker...');

    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('[SW] Service worker registered:', registration);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('[SW] Update found, installing new worker...');

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New version available! Refresh to update.');

            // Notify user about update
            window.dispatchEvent(
              new CustomEvent('sw-update-available', {
                detail: { registration },
              })
            );
          }
        });
      }
    });

    // Check for updates periodically (every hour)
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('[SW] Message from service worker:', event.data);

      if (event.data && event.data.type === 'BACKGROUND_SYNC') {
        // Trigger sync when service worker requests it
        window.dispatchEvent(
          new CustomEvent('sw-background-sync', {
            detail: event.data,
          })
        );
      }
    });

    return registration;
  } catch (error) {
    console.error('[SW] Registration failed:', error);
    return null;
  }
};

/**
 * Unregister all service workers
 */
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      await registration.unregister();
    }

    console.log('[SW] All service workers unregistered');
    return true;
  } catch (error) {
    console.error('[SW] Unregistration failed:', error);
    return false;
  }
};

/**
 * Register for background sync
 */
export const registerBackgroundSync = async (tag: string): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    if ('sync' in registration) {
      await (registration as any).sync.register(tag);
      console.log('[SW] Background sync registered:', tag);
    } else {
      console.log('[SW] Background sync not supported');
    }
  } catch (error) {
    console.error('[SW] Background sync registration failed:', error);
  }
};

/**
 * Send message to service worker
 */
export const sendMessageToSW = async (message: any): Promise<void> => {
  if (typeof window === 'undefined' || !navigator.serviceWorker.controller) {
    return;
  }

  try {
    navigator.serviceWorker.controller.postMessage(message);
    console.log('[SW] Message sent to service worker:', message);
  } catch (error) {
    console.error('[SW] Failed to send message to service worker:', error);
  }
};

/**
 * Clear all service worker caches
 */
export const clearServiceWorkerCache = async (): Promise<void> => {
  await sendMessageToSW({ type: 'CLEAR_CACHE' });

  if (typeof window !== 'undefined' && 'caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('[SW] All caches cleared');
  }
};
