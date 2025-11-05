'use client';

import { useEffect, useState } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';
import { toast } from 'sonner';

export function KeyboardShortcuts() {
  const { openCreateMode } = useSidebar();
  const [hasShownHint, setHasShownHint] = useState(false);

  useEffect(() => {
    // Show keyboard shortcut hint on first visit
    const hintShown = localStorage.getItem('tasq-keyboard-hint-shown');
    if (!hintShown) {
      setTimeout(() => {
        toast.info('💡 Pro tip: Press Ctrl+N to quickly add a task!', {
          duration: 5000,
        });
        localStorage.setItem('tasq-keyboard-hint-shown', 'true');
        setHasShownHint(true);
      }, 10000); // Show after 10 seconds
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N or Cmd+N - Quick add task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openCreateMode();
      }

      // ? - Show shortcuts help (future enhancement)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement as HTMLElement;
        const isInputFocused =
          activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA' ||
          activeElement?.isContentEditable;

        if (!isInputFocused) {
          e.preventDefault();
          // Future: Show shortcuts modal
          toast.info('Keyboard shortcuts:\n• Ctrl+N - New task', {
            duration: 3000,
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openCreateMode]);

  return null; // This component doesn't render anything
}
