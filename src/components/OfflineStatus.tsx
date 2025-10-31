'use client';

import { useSyncStatus } from '@/hooks/useSyncStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, AlertCircle, Check, Loader2, Cloud, XCircle, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { syncManager } from '@/lib/syncManager';
import { SyncStatusPanel } from '@/components/SyncStatusPanel';

const OfflineStatus = () => {
  const { status, isOnline, isSyncing, pendingCount, lastSyncTime, lastError, sync } = useSyncStatus();
  const [mounted, setMounted] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    if (isSyncing) {
      toast.info('Sync already in progress');
      return;
    }

    try {
      await sync();
      if (pendingCount === 0) {
        toast.success('All tasks synced successfully!');
      }
    } catch (error) {
      toast.error(lastError || 'Sync failed');
    }
  };

  const handleClearQueue = async () => {
    if (confirm('Clear all pending sync items? This will remove items from the sync queue. This action cannot be undone.')) {
      try {
        await syncManager.clearSyncQueue();
        toast.success('Sync queue cleared');
        window.location.reload(); // Reload to refresh state
      } catch (error) {
        toast.error('Failed to clear sync queue');
      }
    }
  };

  // Don't render anything on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
        <Wifi className="h-3 w-3" />
      </Badge>
    );
  }

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Never';

    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'offline':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          dotColor: 'bg-red-500',
          icon: WifiOff,
          label: 'Offline',
          message: 'Changes saved locally',
          showSync: false,
        };
      case 'syncing':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          dotColor: 'bg-yellow-500 animate-pulse',
          icon: Loader2,
          label: 'Syncing',
          message: `Syncing ${pendingCount} ${pendingCount === 1 ? 'item' : 'items'}...`,
          showSync: false,
        };
      case 'failed':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          dotColor: 'bg-orange-500',
          icon: AlertCircle,
          label: 'Sync Failed',
          message: `${pendingCount} ${pendingCount === 1 ? 'item' : 'items'} pending`,
          showSync: true,
        };
      case 'synced':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          dotColor: 'bg-green-500',
          icon: Check,
          label: 'Synced',
          message: lastSyncTime ? `Last sync: ${formatLastSync(lastSyncTime)}` : 'All synced',
          showSync: pendingCount > 0,
        };
      case 'online':
      default:
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          dotColor: 'bg-blue-500',
          icon: Wifi,
          label: 'Online',
          message: lastSyncTime ? `Last sync: ${formatLastSync(lastSyncTime)}` : 'Connected',
          showSync: pendingCount > 0,
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <>
      <div className="flex items-center gap-2 text-xs">
        {/* Status Message - Clickable to open panel */}
        <button
          onClick={() => setIsPanelOpen(true)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
          title="View sync details"
        >
          <StatusIcon className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{config.message}</span>
          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

      {/* Pending Count Badge */}
      {pendingCount > 0 && !isSyncing && (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-1.5 py-0 text-xs">
          {pendingCount}
        </Badge>
      )}

      {/* Manual Sync Button */}
      {config.showSync && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="h-6 px-2 text-xs"
            title="Sync now"
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="ml-1">Sync</span>
          </Button>

          {/* Clear Queue Button - only show if there are pending items */}
          {pendingCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearQueue}
              disabled={isSyncing}
              className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Clear sync queue"
            >
              <XCircle className="h-3 w-3" />
            </Button>
          )}
        </>
      )}

      {/* Status Dot Indicator */}
      <button
        onClick={() => setIsPanelOpen(true)}
        className={`h-2 w-2 rounded-full ${config.dotColor} cursor-pointer hover:scale-125 transition-transform`}
        title={`${config.label} - Click for details`}
      />
    </div>

    {/* Sync Status Panel */}
    <SyncStatusPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
};

export default OfflineStatus;