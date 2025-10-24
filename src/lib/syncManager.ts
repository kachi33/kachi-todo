import { Todo, TodoList, CreateTodoData } from '@/types';
import { offlineStorage } from './offlineStorage';
import { ensureSession } from './session';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface SyncResult {
  success: boolean;
  conflicts: ConflictItem[];
  errors: string[];
}

interface ConflictItem {
  type: 'todo' | 'list';
  localItem: any;
  serverItem: any;
  resolution: 'server' | 'local' | 'manual';
}

class SyncManager {
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
  private syncInProgress = false;
  private syncListeners: (() => void)[] = [];

  constructor() {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      this.setupNetworkListeners();
      this.startPeriodicSync();
    }
  }

  private setupNetworkListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Sync when tab becomes visible
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.isOnline) {
          this.triggerSync();
        }
      });
    }
  }

  private startPeriodicSync() {
    if (typeof window === 'undefined') return;

    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.triggerSync();
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  onSyncComplete(callback: () => void) {
    this.syncListeners.push(callback);
  }

  private notifyListeners() {
    this.syncListeners.forEach(callback => callback());
  }

  async triggerSync(): Promise<SyncResult> {
    if (!this.isOnline || this.syncInProgress) {
      return { success: false, conflicts: [], errors: ['Offline or sync in progress'] };
    }

    this.syncInProgress = true;
    const result: SyncResult = {
      success: true,
      conflicts: [],
      errors: []
    };

    try {
      // Step 1: Push local changes to server
      await this.pushLocalChanges(result);

      // Step 2: Pull server changes and detect conflicts
      await this.pullServerChanges(result);

      // Step 3: Update last sync timestamp
      await offlineStorage.setLastSyncTime(Date.now());

      console.log('Sync completed successfully', result);
    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : 'Unknown sync error');
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
      this.notifyListeners();
    }

    return result;
  }

  private async pushLocalChanges(result: SyncResult) {
    const pendingItems = await offlineStorage.getPendingSyncItems();

    for (const item of pendingItems) {
      try {
        if (item.retryCount >= 3) {
          result.errors.push(`Max retries exceeded for ${item.id}`);
          continue;
        }

        switch (item.operation) {
          case 'create':
            await this.pushCreate(item);
            break;
          case 'update':
            await this.pushUpdate(item);
            break;
          case 'delete':
            await this.pushDelete(item);
            break;
        }

        await offlineStorage.markSyncItemCompleted(item.id);
      } catch (error) {
        await offlineStorage.incrementSyncRetry(item.id);
        result.errors.push(`Failed to sync ${item.id}: ${error}`);
      }
    }
  }

  private async pushCreate(item: any) {
    const headers = await this.createAuthHeaders();

    if (item.table === 'todos') {
      const response = await fetch(`${BASE_URL}/api/todos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: item.data.title,
          detail: item.data.detail,
          priority: item.data.priority,
          due_date: item.data.due_date,
          due_time: item.data.due_time,
          list_id: item.data.list_id,
          completed: item.data.completed
        }),
      });

      if (!response.ok) throw new Error(`Create failed: ${response.statusText}`);

      const serverTodo = await response.json();

      // Update local record with server ID
      await offlineStorage.deleteTodo(item.data.id); // Remove temp ID
      await offlineStorage.saveTodo(serverTodo, false); // Save with server ID
    }
  }

  private async pushUpdate(item: any) {
    const headers = await this.createAuthHeaders();

    if (item.table === 'todos') {
      const response = await fetch(`${BASE_URL}/api/todos/${item.data.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          title: item.data.title,
          detail: item.data.detail,
          priority: item.data.priority,
          due_date: item.data.due_date,
          due_time: item.data.due_time,
          completed: item.data.completed
        }),
      });

      if (!response.ok) throw new Error(`Update failed: ${response.statusText}`);
    }
  }

  private async pushDelete(item: any) {
    const headers = await this.createAuthHeaders();

    if (item.table === 'todos') {
      const response = await fetch(`${BASE_URL}/api/todos/${item.data.id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }
    }
  }

  private async pullServerChanges(result: SyncResult) {
    const lastSync = await offlineStorage.getLastSyncTime();

    try {
      // Fetch todos from server
      const headers = await this.createAuthHeaders();
      const todosResponse = await fetch(`${BASE_URL}/api/todos`, { headers });
      const listsResponse = await fetch(`${BASE_URL}/api/lists`, { headers });

      if (!todosResponse.ok || !listsResponse.ok) {
        throw new Error('Failed to fetch server data');
      }

      const serverTodos: Todo[] = await todosResponse.json();
      const serverLists: TodoList[] = await listsResponse.json();

      // Get local data
      const localTodos = await offlineStorage.getTodos();
      const localLists = await offlineStorage.getTodoLists();

      // Detect and resolve conflicts
      const { resolvedTodos, conflicts: todoConflicts } = this.resolveConflicts(
        localTodos,
        serverTodos,
        'todo'
      );

      result.conflicts.push(...todoConflicts);

      // Save resolved data to local storage
      await offlineStorage.saveTodos(resolvedTodos);
      await offlineStorage.saveTodoLists(serverLists);

    } catch (error) {
      throw new Error(`Failed to pull server changes: ${error}`);
    }
  }

  private resolveConflicts(localItems: any[], serverItems: any[], type: 'todo' | 'list') {
    const resolved: any[] = [];
    const conflicts: ConflictItem[] = [];

    // Create maps for efficient lookup
    const localMap = new Map(localItems.map(item => [item.id, item]));
    const serverMap = new Map(serverItems.map(item => [item.id, item]));

    // Process server items (authoritative)
    for (const serverItem of serverItems) {
      const localItem = localMap.get(serverItem.id);

      if (!localItem) {
        // New item from server
        resolved.push(serverItem);
      } else if (localItem.offline) {
        // Local item was modified offline - potential conflict
        const conflict = this.detectConflict(localItem, serverItem);

        if (conflict) {
          // For now, use "last write wins" strategy
          const resolvedItem = localItem.lastModified > new Date(serverItem.updated_at || serverItem.created_at).getTime()
            ? localItem
            : serverItem;

          resolved.push(resolvedItem);
          conflicts.push({
            type,
            localItem,
            serverItem,
            resolution: resolvedItem === localItem ? 'local' : 'server'
          });
        } else {
          resolved.push(serverItem);
        }
      } else {
        // Use server version (most recent)
        resolved.push(serverItem);
      }

      localMap.delete(serverItem.id);
    }

    // Add remaining local items (not on server - likely offline creations)
    for (const [_, localItem] of localMap) {
      if (localItem.offline) {
        resolved.push(localItem);
      }
    }

    return { resolvedTodos: resolved, conflicts };
  }

  private detectConflict(localItem: any, serverItem: any): boolean {
    // Check if there are meaningful differences
    const fieldsToCheck = ['title', 'detail', 'priority', 'due_date', 'due_time', 'completed'];

    return fieldsToCheck.some(field => {
      const localValue = localItem[field];
      const serverValue = serverItem[field];

      // Handle null/undefined comparisons
      if (localValue == null && serverValue == null) return false;
      if (localValue == null || serverValue == null) return true;

      return localValue !== serverValue;
    });
  }

  private async createAuthHeaders() {
    const sessionId = await ensureSession();
    return {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId,
    };
  }

  // Public methods for offline operations
  async createTodoOffline(todoData: CreateTodoData): Promise<Todo> {
    // Create temporary negative ID for offline items
    const tempId = -Date.now();

    const offlineTodo: Todo = {
      id: tempId,
      title: todoData.title,
      detail: todoData.detail || '',
      priority: todoData.priority || 'medium',
      due_date: todoData.due_date,
      due_time: todoData.due_time,
      completed: todoData.completed || false,
      list_id: todoData.list_id,
      list_name: '', // Will be resolved during sync
      userId: 'offline'
    };

    await offlineStorage.saveTodo(offlineTodo, true);

    // Try to sync immediately if online
    if (this.isOnline) {
      this.triggerSync();
    }

    return offlineTodo;
  }

  async updateTodoOffline(id: number, updates: Partial<CreateTodoData>): Promise<void> {
    const localTodos = await offlineStorage.getTodos();
    const todo = localTodos.find(t => t.id === id);

    if (!todo) {
      throw new Error(`Todo with id ${id} not found in offline storage`);
    }

    const updatedTodo = { ...todo, ...updates };
    await offlineStorage.saveTodo(updatedTodo, true);

    // Try to sync immediately if online
    if (this.isOnline) {
      this.triggerSync();
    }
  }

  async deleteTodoOffline(id: number): Promise<void> {
    await offlineStorage.deleteTodo(id, true);

    // Try to sync immediately if online
    if (this.isOnline) {
      this.triggerSync();
    }
  }

  getNetworkStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress
    };
  }
}

export const syncManager = new SyncManager();