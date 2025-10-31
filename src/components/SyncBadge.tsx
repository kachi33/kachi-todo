import { Cloud, CloudOff, Loader2, AlertCircle, Check } from 'lucide-react';

export type SyncBadgeStatus = 'pending' | 'syncing' | 'failed' | 'synced';

interface SyncBadgeProps {
  status: SyncBadgeStatus;
  className?: string;
  showIcon?: boolean;
}

export function SyncBadge({ status, className = '', showIcon = false }: SyncBadgeProps) {
  const getConfig = () => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-blue-500',
          icon: Cloud,
          label: 'Waiting to sync',
          animate: 'animate-pulse',
        };
      case 'syncing':
        return {
          color: 'bg-yellow-500',
          icon: Loader2,
          label: 'Syncing...',
          animate: 'animate-spin',
        };
      case 'failed':
        return {
          color: 'bg-red-500',
          icon: AlertCircle,
          label: 'Sync failed',
          animate: '',
        };
      case 'synced':
        return {
          color: 'bg-green-500',
          icon: Check,
          label: 'Synced',
          animate: '',
        };
      default:
        return {
          color: 'bg-gray-500',
          icon: Cloud,
          label: 'Unknown',
          animate: '',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  if (showIcon) {
    return (
      <div
        className={`flex items-center gap-1.5 ${className}`}
        title={config.label}
      >
        <Icon className={`h-3.5 w-3.5 text-muted-foreground ${config.animate}`} />
        <span className="text-xs text-muted-foreground">{config.label}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative group ${className}`}
      title={config.label}
    >
      {/* Colored dot */}
      <div
        className={`h-2 w-2 rounded-full ${config.color} ${config.animate}`}
      />

      {/* Tooltip */}
      <div className="absolute invisible group-hover:visible bg-popover text-popover-foreground text-xs rounded px-2 py-1 shadow-lg -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 border border-border">
        {config.label}
        {/* Arrow */}
        <div className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover top-full left-1/2 -translate-x-1/2 -mt-px" />
      </div>
    </div>
  );
}
