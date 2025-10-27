'use client';

import { Button } from "@/components/ui/button";

export type MockState = 'loading' | 'error' | 'empty' | 'content' | null;

interface DevStateTogglerProps {
  currentState: MockState;
  onStateChange: (state: MockState) => void;
}

export default function DevStateToggler({ currentState, onStateChange }: DevStateTogglerProps) {
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold text-muted-foreground mb-1">Dev State Toggle</div>
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
