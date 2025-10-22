import { Todo, TodoList } from '@/types';

interface SyncRecord {
  id: string;
  operation: 'create' | 'update' | 'delete';
  table: 'todos' | 'lists';
  data: any;
  timestamp: number;
  retryCount: number;
  synced: boolean;
}

interface OfflineData {
  todos: Todo[];
  todoLists: TodoList[];
  syncQueue: SyncRecord[];
  lastSync: number;
}

class OfflineStorageManager {
  private dbName = 'kachi-todo-offline';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    // Skip initialization on server-side
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Todos store
        if (!db.objectStoreNames.contains('todos')) {
          const todosStore = db.createObjectStore('todos', { keyPath: 'id' });
          todosStore.createIndex('listId', 'list_id', { unique: false });
          todosStore.createIndex('completed', 'completed', { unique: false });
          todosStore.createIndex('lastModified', 'lastModified', { unique: false });
        }

        // Todo Lists store
        if (!db.objectStoreNames.contains('todoLists')) {
          const listsStore = db.createObjectStore('todoLists', { keyPath: 'id' });
          listsStore.createIndex('name', 'name', { unique: false });
        }

        // Sync Queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('synced', 'synced', { unique: false });
        }

        // Metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  // Todo operations
  async saveTodos(todos: Todo[]): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');

    for (const todo of todos) {
      const todoWithTimestamp = {
        ...todo,
        lastModified: Date.now(),
        offline: false
      };
      await store.put(todoWithTimestamp);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getTodos(): Promise<Todo[]> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['todos'], 'readonly');
    const store = transaction.objectStore('todos');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveTodo(todo: Todo, isOfflineChange = false): Promise<void> {
    if (!this.db) await this.init();

    const todoWithTimestamp = {
      ...todo,
      lastModified: Date.now(),
      offline: isOfflineChange
    };

    const transaction = this.db!.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');
    await store.put(todoWithTimestamp);

    // Add to sync queue if it's an offline change
    if (isOfflineChange) {
      await this.addToSyncQueue({
        id: `todo-${todo.id}-${Date.now()}`,
        operation: todo.id < 0 ? 'create' : 'update',
        table: 'todos',
        data: todo,
        timestamp: Date.now(),
        retryCount: 0,
        synced: false
      });
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async deleteTodo(todoId: number, isOfflineChange = false): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');
    await store.delete(todoId);

    // Add to sync queue if it's an offline change
    if (isOfflineChange) {
      await this.addToSyncQueue({
        id: `todo-delete-${todoId}-${Date.now()}`,
        operation: 'delete',
        table: 'todos',
        data: { id: todoId },
        timestamp: Date.now(),
        retryCount: 0,
        synced: false
      });
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Todo Lists operations
  async saveTodoLists(lists: TodoList[]): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['todoLists'], 'readwrite');
    const store = transaction.objectStore('todoLists');

    for (const list of lists) {
      await store.put({ ...list, lastModified: Date.now() });
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getTodoLists(): Promise<TodoList[]> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['todoLists'], 'readonly');
    const store = transaction.objectStore('todoLists');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync Queue operations
  async addToSyncQueue(record: SyncRecord): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    await store.put(record);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getPendingSyncItems(): Promise<SyncRecord[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];

    const transaction = this.db.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const allItems = request.result || [];
        // Filter for items that haven't been synced
        const pendingItems = allItems.filter((item: SyncRecord) => !item.synced);
        resolve(pendingItems);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async markSyncItemCompleted(syncId: string): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');

    const getRequest = store.get(syncId);
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const record = getRequest.result;
        if (record) {
          record.synced = true;
          const putRequest = store.put(record);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async incrementSyncRetry(syncId: string): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');

    const getRequest = store.get(syncId);
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const record = getRequest.result;
        if (record) {
          record.retryCount += 1;
          const putRequest = store.put(record);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Metadata operations
  async setLastSyncTime(timestamp: number): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['metadata'], 'readwrite');
    const store = transaction.objectStore('metadata');
    await store.put({ key: 'lastSync', value: timestamp });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getLastSyncTime(): Promise<number> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['metadata'], 'readonly');
    const store = transaction.objectStore('metadata');
    const request = store.get('lastSync');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : 0);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['todos', 'todoLists', 'syncQueue', 'metadata'], 'readwrite');

    await transaction.objectStore('todos').clear();
    await transaction.objectStore('todoLists').clear();
    await transaction.objectStore('syncQueue').clear();
    await transaction.objectStore('metadata').clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const offlineStorage = new OfflineStorageManager();