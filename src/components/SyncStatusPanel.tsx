'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Activity,
  Upload,
  Download,
  Plus,
  Edit,
  X
} from 'lucide-react';
import { offlineStorage } from '@/lib/offlineStorage';
import { syncManager } from '@/lib/syncManager';
import { SyncHistoryItem } from '@/types';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface SyncStatusPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SyncStatusPanel({ isOpen, onClose }: SyncStatusPanelProps) {
  const { status, isOnline, isSyncing, pendingCount, lastSyncTime, lastError, sync } = useSyncStatus();
  const [history, setHistory] = useState<SyncHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleHistoryUpdate = () => {
      if (isOpen) {
        loadHistory();
      }
    };

    window.addEventListener('sync:history-updated', handleHistoryUpdate);
    window.addEventListener('sync:complete', handleHistoryUpdate);

    return () => {
      window.removeEventListener('sync:history-updated', handleHistoryUpdate);
      window.removeEventListener('sync:complete', handleHistoryUpdate);
    };
  }, [isOpen]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const items = await offlineStorage.getSyncHistory(20);
      setHistory(items);
    } catch (error) {
      console.error('Failed to load sync history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleManualSync = async () => {
    try {
      await sync();
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear the sync history?')) {
      try {
        await offlineStorage.clearSyncHistory();
        setHistory([]);
        toast.success('Sync history cleared');
      } catch (error) {
        toast.error('Failed to clear history');
        console.error('Failed to clear history:', error);
      }
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: RefreshCw,
          label: 'Syncing...',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
        };
      case 'failed':
        return {
          icon: XCircle,
          label: 'Sync Failed',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
        };
      case 'offline':
        return {
          icon: AlertCircle,
          label: 'Offline',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
        };
      case 'synced':
        return {
          icon: CheckCircle2,
          label: 'Synced',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
        };
      default:
        return {
          icon: Activity,
          label: 'Online',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200',
        };
    }
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'create':
        return Plus;
      case 'update':
        return Edit;
      case 'delete':
        return X;
      case 'sync':
        return RefreshCw;
      default:
        return Activity;
    }
  };

  const getStatusBadge = (historyStatus: string) => {
    switch (historyStatus) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      case 'conflict':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Conflict</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <Card className="w-full sm:max-w-2xl bg-background max-h-[90vh] overflow-hidden flex flex-col rounded-t-xl sm:rounded-xl">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
              <StatusIcon className={`w-5 h-5 ${statusConfig.color} ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Sync Status</h2>
              <p className="text-sm text-muted-foreground">
                {isOnline ? 'Connected' : 'Offline mode'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Status Summary */}
        <div className="p-4 space-y-4 border-b">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{history.filter(h => h.status === 'success').length}</div>
              <div className="text-xs text-muted-foreground">Successful</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{history.filter(h => h.status === 'failed').length}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
          </div>

          {lastError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-red-900">Last Error</div>
                <div className="text-sm text-red-700">{lastError}</div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="default"
              size="default"
              onClick={handleManualSync}
              disabled={!isOnline || isSyncing}
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={handleClearHistory}
              disabled={history.length === 0}
              className=""
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          </div>
        </div>

        {/* Sync History */}
        {/* <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Activity
          </h3>

          {isLoadingHistory ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No sync activity yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => {
                const OperationIcon = getOperationIcon(item.operation);
                return (
                  <div
                    key={item.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${statusConfig.bgColor} flex-shrink-0`}>
                          <OperationIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium capitalize">
                              {item.operation}
                            </span>
                            {getStatusBadge(item.status)}
                          </div>
                          {item.itemTitle && (
                            <div className="text-sm text-muted-foreground truncate">
                              {item.itemTitle}
                            </div>
                          )}
                          {item.error && (
                            <div className="text-xs text-red-600 mt-1">
                              {item.error}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <span>
                              {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                            </span>
                            {item.duration && (
                              <>
                                <span>•</span>
                                <span>{item.duration}ms</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div> */}
      </Card>
    </div>
  );
}
