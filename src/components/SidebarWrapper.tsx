'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { Sidebar } from '@/components/Sidebar';

export default function SidebarWrapper() {
  const { isOpen, selectedTodo, mode, closeSidebar, toggleSidebar } = useSidebar();

  return (
    <Sidebar
      todo={selectedTodo}
      mode={mode}
      isOpen={isOpen}
      onClose={closeSidebar}
      onToggle={toggleSidebar}
    />
  );
}
