'use client';

import { useEffect } from 'react';
import { registerServiceWorker, registerBackgroundSync } from '@/lib/serviceWorker';
import { syncManager } from '@/lib/syncManager';
import { toast } from 'sonner';

/**
 * PWA Provider Component
 * Handles service worker registration and PWA features
 */
export function PWAProvider() {
  useEffect(() => {
    // Register service worker on mount
    const initServiceWorker = async () => {
      const registration = await registerServiceWorker();

      if (registration) {
        console.log('[PWA] Service worker registered successfully');
      }
    };

    initServiceWorker();

    // Listen for service worker update available
    const handleUpdateAvailable = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('[PWA] Update available');

      toast.info('A new version is available!', {
        description: 'Refresh the page to update',
        action: {
          label: 'Refresh',
          onClick: () => window.location.reload(),
        },
        duration: Infinity,
      });
    };

    // Listen for background sync from service worker
    const handleBackgroundSync = async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('[PWA] Background sync requested:', customEvent.detail);

      // Trigger sync manager
      try {
        await syncManager.triggerSync();
        console.log('[PWA] Background sync completed');
      } catch (error) {
        console.error('[PWA] Background sync failed:', error);
      }
    };

    // Listen for online event to trigger sync
    const handleOnline = async () => {
      console.log('[PWA] Connection restored, triggering sync...');

      // Register background sync if supported
      await registerBackgroundSync('sync-todos');

      // Also trigger immediate sync
      setTimeout(async () => {
        try {
          await syncManager.triggerSync();
        } catch (error) {
          console.error('[PWA] Online sync failed:', error);
        }
      }, 1000);
    };

    window.addEventListener('sw-update-available', handleUpdateAvailable);
    window.addEventListener('sw-background-sync', handleBackgroundSync);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable);
      window.removeEventListener('sw-background-sync', handleBackgroundSync);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null; // This component doesn't render anything
}
