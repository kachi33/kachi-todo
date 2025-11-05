'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/contexts/SidebarContext';

export function QuickAddButton() {
  const { openCreateMode } = useSidebar();

  const handleClick = () => {
    openCreateMode();
  };

  return (
    <Button
      variant="default"
      size="lg"
      onClick={handleClick}
      className="
        fixed bottom-24 right-4 z-40
        h-14 w-14 rounded-full shadow-lg
        bg-gradient-to-r from-amber-700 to-amber-500
        hover:from-amber-600 hover:to-amber-400
        transition-all duration-300
        hover:scale-110 hover:shadow-xl
        active:scale-95
        group
      "
      aria-label="Quick add task"
      title="Quick add task (Ctrl+N)"
    >
      <Plus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
    </Button>
  );
}
