'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Global component that listens to sync events and shows toast notifications
 * Should be mounted once in the app layout
 */
export function SyncToastNotifier() {
  useEffect(() => {
    // Listen for sync complete events
    const handleSyncComplete = (event: Event) => {
      const customEvent = event as CustomEvent;
      const result = customEvent.detail;

      // Only show toast for bulk syncs (when errors occur or multiple items synced)
      if (result?.errors && result.errors.length > 0) {
        // Show error toast for failures
        toast.error(`Sync failed: ${result.errors[0]}`, {
          description: result.errors.length > 1 ? `${result.errors.length} items failed to sync` : undefined,
        });
      } else if (result?.conflicts && result.conflicts.length > 0) {
        // Show warning for conflicts
        toast.warning(`${result.conflicts.length} conflict${result.conflicts.length === 1 ? '' : 's'} detected`, {
          description: 'Some items have conflicts that need resolution',
        });
      }
      // We don't show success toast here - it's handled by OfflineStatus component when manually syncing
    };

    // Listen for sync errors
    const handleSyncError = (event: Event) => {
      const customEvent = event as CustomEvent;
      const error = customEvent.detail;

      toast.error('Sync failed', {
        description: error?.message || 'Unable to sync your tasks. Check your connection.',
      });
    };

    // Register event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('sync:complete', handleSyncComplete);
      window.addEventListener('sync:error', handleSyncError);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('sync:complete', handleSyncComplete);
        window.removeEventListener('sync:error', handleSyncError);
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
}
