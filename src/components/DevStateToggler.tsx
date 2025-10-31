'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Wifi, WifiOff } from "lucide-react";

export type MockState = 'loading' | 'error' | 'empty' | 'content' | null;

interface DevStateTogglerProps {
  currentState: MockState;
  onStateChange: (state: MockState) => void;
}

export default function DevStateToggler({ currentState, onStateChange }: DevStateTogglerProps) {
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const toggleOfflineMode = () => {
    const newOfflineMode = !isOfflineMode;
    setIsOfflineMode(newOfflineMode);

    // Simulate network change by dispatching events
    if (newOfflineMode) {
      // Simulate going offline
      window.dispatchEvent(new Event('offline'));
      // Override navigator.onLine temporarily
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });
    } else {
      // Simulate going online
      window.dispatchEvent(new Event('online'));
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 max-w-[200px]">
      <div className="flex flex-col gap-3">
        <div className="text-xs font-semibold text-muted-foreground">Dev Tools</div>

        {/* Offline Mode Toggle */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isOfflineMode ? (
              <WifiOff className="w-4 h-4 text-red-500" />
            ) : (
              <Wifi className="w-4 h-4 text-green-500" />
            )}
            <span className="text-xs">Offline Mode</span>
          </div>
          <Switch
            checked={isOfflineMode}
            onCheckedChange={toggleOfflineMode}
            className="scale-75"
          />
        </div>

        <Separator className="my-1" />

        <div className="text-xs text-muted-foreground">UI State</div>
        <div className="flex flex-col gap-1">
          <Button
            variant={currentState === 'loading' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStateChange('loading')}
            className="w-full justify-start text-xs"
          >
            Loading
          </Button>
          <Button
            variant={currentState === 'error' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStateChange('error')}
            className="w-full justify-start text-xs"
          >
            Error
          </Button>
          <Button
            variant={currentState === 'empty' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStateChange('empty')}
            className="w-full justify-start text-xs"
          >
            Empty
          </Button>
          <Button
            variant={currentState === 'content' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStateChange('content')}
            className="w-full justify-start text-xs"
          >
            Content
          </Button>
          <Button
            variant={currentState === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStateChange(null)}
            className="w-full justify-start text-xs"
          >
            Real Data
          </Button>
        </div>
      </div>
    </div>
  );
}
