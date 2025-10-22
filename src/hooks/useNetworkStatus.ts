import { useState, useEffect } from 'react';
import { syncManager } from '@/lib/syncManager';

interface NetworkStatus {
  isOnline: boolean;
  isConnected: boolean;
  syncInProgress: boolean;
  lastSyncTime: number | null;
}

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isConnected: navigator.onLine,
    syncInProgress: false,
    lastSyncTime: null
  });

  useEffect(() => {
    const updateStatus = () => {
      const { isOnline, syncInProgress } = syncManager.getNetworkStatus();
      setStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine,
        isConnected: isOnline,
        syncInProgress
      }));
    };

    // Initial status update
    updateStatus();

    // Listen for network changes
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true, isConnected: true }));
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false, isConnected: false }));
    };

    // Listen for sync completion
    const handleSyncComplete = () => {
      setStatus(prev => ({
        ...prev,
        syncInProgress: false,
        lastSyncTime: Date.now()
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register sync listener
    syncManager.onSyncComplete(handleSyncComplete);

    // Periodic status updates
    const interval = setInterval(updateStatus, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const forceSync = async () => {
    if (status.isOnline && !status.syncInProgress) {
      setStatus(prev => ({ ...prev, syncInProgress: true }));
      try {
        await syncManager.triggerSync();
      } finally {
        setStatus(prev => ({ ...prev, syncInProgress: false }));
      }
    }
  };

  return {
    ...status,
    forceSync
  };
};