'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const OfflineStatus = () => {
  const { isOnline, syncInProgress, lastSyncTime, forceSync } = useNetworkStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
        <Wifi className="h-3 w-3" />
        Online
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

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-100 text-red-800 border-red-200';
    if (syncInProgress) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-3 w-3" />;
    if (syncInProgress) return <RefreshCw className="h-3 w-3 animate-spin" />;
    return <Wifi className="h-3 w-3" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncInProgress) return 'Syncing...';
    return 'Online';
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge className={`${getStatusColor()} flex items-center gap-1`}>
        {getStatusIcon()}
        {getStatusText()}
      </Badge>

      {!isOnline && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          <span>Changes saved locally</span>
        </div>
      )}

      {isOnline && lastSyncTime && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Check className="h-3 w-3" />
          <span>Last sync: {formatLastSync(lastSyncTime)}</span>
        </div>
      )}

      {isOnline && !syncInProgress && (
        <Button
          variant="ghost"
          size="sm"
          onClick={forceSync}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Sync
        </Button>
      )}
    </div>
  );
};

export default OfflineStatus;