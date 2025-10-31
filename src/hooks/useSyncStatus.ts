import { useState, useEffect } from 'react';
import { syncManager } from '@/lib/syncManager';
import { offlineStorage } from '@/lib/offlineStorage';

export type SyncStatus = 'online' | 'offline' | 'syncing' | 'failed' | 'synced';

export interface SyncStatusData {
  status: SyncStatus;
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: number | null;
  lastError: string | null;
  sync: () => Promise<void>;
}

export function useSyncStatus(): SyncStatusData {
  const [status, setStatus] = useState<SyncStatus>('online');
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize state
    const initializeState = async () => {
      const networkStatus = syncManager.getNetworkStatus();
      setIsOnline(networkStatus.isOnline);
      setIsSyncing(networkStatus.syncInProgress);

      const pending = await offlineStorage.getPendingSyncItems();
      setPendingCount(pending.length);

      const lastSync = await offlineStorage.getLastSyncTime();
      setLastSyncTime(lastSync || null);

      // Determine initial status
      if (!networkStatus.isOnline) {
        setStatus('offline');
      } else if (networkStatus.syncInProgress) {
        setStatus('syncing');
      } else if (pending.length > 0) {
        setStatus('failed');
      } else {
        setStatus('synced');
      }
    };

    initializeState();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setStatus('online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setStatus('offline');
    };

    // Listen for sync events
    const handleSyncStart = () => {
      setIsSyncing(true);
      setStatus('syncing');
      setLastError(null);
    };

    const handleSyncComplete = async () => {
      setIsSyncing(false);
      const pending = await offlineStorage.getPendingSyncItems();
      setPendingCount(pending.length);

      const lastSync = await offlineStorage.getLastSyncTime();
      setLastSyncTime(lastSync || null);

      if (pending.length === 0) {
        setStatus('synced');
      } else {
        setStatus('failed');
      }
    };

    const handleSyncError = (error: any) => {
      setIsSyncing(false);
      setStatus('failed');
      setLastError(error.message || 'Sync failed');
    };

    // Register event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // Register sync manager listeners
    syncManager.onSyncComplete(handleSyncComplete);

    // Custom event listeners for sync events (we'll add these to syncManager)
    const syncStartHandler = () => handleSyncStart();
    const syncErrorHandler = (event: Event) => {
      const customEvent = event as CustomEvent;
      handleSyncError(customEvent.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('sync:start', syncStartHandler);
      window.addEventListener('sync:error', syncErrorHandler);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('sync:start', syncStartHandler);
        window.removeEventListener('sync:error', syncErrorHandler);
      }
    };
  }, []);

  // Manual sync trigger
  const sync = async () => {
    if (!isOnline) {
      throw new Error('Cannot sync while offline');
    }

    setIsSyncing(true);
    setStatus('syncing');

    try {
      await syncManager.triggerSync();
      const pending = await offlineStorage.getPendingSyncItems();
      setPendingCount(pending.length);

      if (pending.length === 0) {
        setStatus('synced');
      } else {
        setStatus('failed');
      }
    } catch (error) {
      setStatus('failed');
      setLastError(error instanceof Error ? error.message : 'Sync failed');
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    status,
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncTime,
    lastError,
    sync,
  };
}
