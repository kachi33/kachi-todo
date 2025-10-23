'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { Sidebar } from '@/components/Sidebar';

export default function SidebarWrapper() {
  const { isOpen, selectedTodo, closeSidebar } = useSidebar();

  return (
    <Sidebar
      todo={selectedTodo}
      isOpen={isOpen}
      onClose={closeSidebar}
    />
  );
}
