'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const OfflineStatus = () => {
  const { isOnline, syncInProgress, lastSyncTime, forceSync } = useNetworkStatus();
  const [mounted, setMounted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (syncInProgress) {
      // Sync started - record the time and start spinning
      if (!spinStartTimeRef.current) {
        spinStartTimeRef.current = Date.now();
      }
      setIsSpinning(true);
    } else if (spinStartTimeRef.current) {
      // Sync completed - check if 3 seconds have passed
      const elapsed = Date.now() - spinStartTimeRef.current;
      const remaining = Math.max(0, 3000 - elapsed);

      const timer = setTimeout(() => {
        setIsSpinning(false);
        spinStartTimeRef.current = null;
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [syncInProgress]);

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

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-100 text-red-800 border-red-200';
    if (syncInProgress) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-3 w-3" />;
    return <Wifi className="h-3 w-3" />;
  };

  return (
    <div className="flex items-center gap-1 text-xs">

      {!isOnline && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          <span>Changes saved locally</span>
        </div>
      )}

      {isOnline && lastSyncTime && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <span>Last sync: {formatLastSync(lastSyncTime)}</span>
        </div>
      )}

      {isOnline && (
        <Button
          variant="ghost"
          size="sm"
          onClick={forceSync}
          disabled={isSpinning}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className={`h-3 w-3 ${isSpinning ? 'animate-spin' : ''}`} />
        </Button>
      )}
      <Badge className={`${getStatusColor()} flex rounded-full items-center justify-center w-3 h-3 p-0 m-0`}>
        {getStatusIcon()}
      </Badge>
    </div>
  );
};

export default OfflineStatus;