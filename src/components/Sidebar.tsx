import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Clock, User, Tag, FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createTodo, fetchTodoLists } from '@/lib/offlineApi';
import { Todo, TodoList, CreateTodoData } from '@/types';

interface SidebarProps {
  todo: Todo | null;
  mode: 'view' | 'create';
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export const Sidebar = ({ todo, mode, isOpen, onClose, onToggle }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const queryClient = useQueryClient();

  // Create todo form state
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch todo lists for create mode
  const { data: todoLists = [] } = useQuery({
    queryKey: ['todoLists'],
    queryFn: () => fetchTodoLists(),
    enabled: mode === 'create',
  });

  const handleCreateTodo = async () => {
    if (!title.trim() || !selectedListId) return;

    setIsCreating(true);
    try {
      const todoData: CreateTodoData = {
        title: title.trim(),
        detail: detail.trim() || undefined,
        priority,
        due_date: dueDate || undefined,
        due_time: dueTime || undefined,
        list_id: selectedListId,
        completed: false,
      };

      await createTodo(todoData);

      // Reset form
      setTitle('');
      setDetail('');
      setPriority('medium');
      setDueDate('');
      setDueTime('');
      setSelectedListId(null);

      // Refresh todos
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todoLists'] });

      // Close sidebar
      onClose();
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not set';
    return timeString;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full bg-background border-l border-border z-50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-12' : 'w-80 lg:w-96'}
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">
              {mode === 'create' ? 'Create New Todo' : 'Todo Details'}
            </h2>
          )}

          <div className="flex items-center gap-2">
            {/* Collapse/Expand button - Desktop only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {mode === 'create' ? (
              <>
                {/* Create Todo Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter todo title..."
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="list">List *</Label>
                    <Select
                      id="list"
                      value={selectedListId?.toString() || ""}
                      onValueChange={(value) => setSelectedListId(parseInt(value))}
                    >
                      {todoLists.map((list: TodoList) => (
                        <SelectItem key={list.id} value={list.id.toString()}>
                          📋 {list.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select id="priority" value={priority} onValueChange={setPriority}>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueTime">Due Time</Label>
                      <Input
                        id="dueTime"
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="detail">Description</Label>
                    <Textarea
                      id="detail"
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      placeholder="Enter todo description..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCreateTodo}
                      disabled={!title.trim() || !selectedListId || isCreating}
                      className="flex-1"
                    >
                      {isCreating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Todo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : todo ? (
              <>
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <h3 className="text-xl font-semibold text-foreground leading-tight">
                    {todo.title}
                  </h3>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge
                    className={`${
                      todo.completed
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }`}
                  >
                    {todo.completed ? "✅ Completed" : "⏳ Pending"}
                  </Badge>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <Badge className={getPriorityColor(todo.priority)}>
                    <Tag className="h-3 w-3 mr-1" />
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                  </Badge>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Due Date
                  </label>
                  <p className="text-sm text-foreground">
                    {formatDate(todo.due_date)}
                  </p>
                </div>

                {/* Due Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Due Time
                  </label>
                  <p className="text-sm text-foreground">
                    {formatTime(todo.due_time)}
                  </p>
                </div>

                {/* List */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">List</label>
                  <Badge variant="outline" className="text-sm">
                    📋 {todo.list_name}
                  </Badge>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Description
                  </label>
                  {todo.detail ? (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {todo.detail}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No description provided
                    </p>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-muted-foreground">Metadata</h4>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Todo ID:</span>
                      <span className="text-foreground font-mono">#{todo.id}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">List ID:</span>
                      <span className="text-foreground font-mono">#{todo.list_id}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">User:</span>
                      <span className="text-foreground">{todo.userId}</span>
                    </div>
                  </div>
                </div>

              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Todo Selected
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select a todo from the list to view its details here
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collapsed state indicator */}
        {isCollapsed && todo && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="transform -rotate-90 text-xs text-muted-foreground whitespace-nowrap">
              Details
            </div>
          </div>
        )}
      </div>
    </>
  );
};