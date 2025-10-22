'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Todo } from '@/types';

interface SidebarContextType {
  isOpen: boolean;
  selectedTodo: Todo | null;
  mode: 'view' | 'create';
  openSidebar: (todo: Todo) => void;
  openCreateMode: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [mode, setMode] = useState<'view' | 'create'>('view');

  const openSidebar = (todo: Todo) => {
    setSelectedTodo(todo);
    setMode('view');
    setIsOpen(true);
  };

  const openCreateMode = () => {
    setSelectedTodo(null);
    setMode('create');
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    // Keep the selectedTodo for a brief moment to allow smooth closing animation
    setTimeout(() => {
      setSelectedTodo(null);
      setMode('view');
    }, 300);
  };

  const toggleSidebar = () => {
    if (isOpen) {
      closeSidebar();
    } else if (selectedTodo || mode === 'create') {
      setIsOpen(true);
    }
  };

  const value = {
    isOpen,
    selectedTodo,
    mode,
    openSidebar,
    openCreateMode,
    closeSidebar,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};