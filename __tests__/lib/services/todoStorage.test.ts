import { Todo } from '@/types/todo';
import {
  saveTodos,
  loadTodos,
  clearTodos,
  isStorageAvailable,
  StorageError,
  ERROR_MESSAGES,
} from '@/lib/services/todoStorage';

describe('todoStorage', () => {
  let getItemSpy: jest.SpyInstance | null = null;
  let setItemSpy: jest.SpyInstance | null = null;
  let removeItemSpy: jest.SpyInstance | null = null;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Ensure all spies are cleared
    if (getItemSpy) getItemSpy.mockRestore();
    if (setItemSpy) setItemSpy.mockRestore();
    if (removeItemSpy) removeItemSpy.mockRestore();
    getItemSpy = null;
    setItemSpy = null;
    removeItemSpy = null;
  });

  afterEach(() => {
    localStorage.clear();
    // Clean up any spies
    if (getItemSpy) getItemSpy.mockRestore();
    if (setItemSpy) setItemSpy.mockRestore();
    if (removeItemSpy) removeItemSpy.mockRestore();
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });

    it('should return false when localStorage is unavailable', () => {
      setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });

      expect(isStorageAvailable()).toBe(false);

      setItemSpy.mockRestore();
      setItemSpy = null;
    });
  });

  describe('saveTodos', () => {
    it('should save todos to localStorage successfully', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Test todo', completed: false, createdAt: Date.now() },
        { id: '2', text: 'Another todo', completed: true, createdAt: Date.now() },
      ];

      saveTodos(mockTodos);

      const stored = localStorage.getItem('todos');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(mockTodos);
    });

    it('should save todos with custom storage key', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Test todo', completed: false, createdAt: Date.now() },
      ];
      const customKey = 'custom-todos-key';

      saveTodos(mockTodos, customKey);

      const stored = localStorage.getItem(customKey);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(mockTodos);
    });

    it('should save empty array successfully', () => {
      saveTodos([]);

      const stored = localStorage.getItem('todos');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual([]);
    });

    it('should throw StorageError with QUOTA_EXCEEDED code when quota is exceeded', () => {
      setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      const quotaError = new DOMException('Quota exceeded', 'QuotaExceededError');
      setItemSpy.mockImplementation(() => {
        throw quotaError;
      });

      expect(() => saveTodos([])).toThrow(StorageError);
      expect(() => saveTodos([])).toThrow(ERROR_MESSAGES.QUOTA_EXCEEDED);

      try {
        saveTodos([]);
      } catch (error) {
        expect(error).toBeInstanceOf(StorageError);
        expect((error as StorageError).code).toBe('QUOTA_EXCEEDED');
      }

      setItemSpy.mockRestore();
      setItemSpy = null;
    });

    it('should throw StorageError with UNAVAILABLE code when localStorage is unavailable', () => {
      setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('Storage not available');
      });

      expect(() => saveTodos([])).toThrow(StorageError);

      try {
        saveTodos([]);
      } catch (error) {
        expect(error).toBeInstanceOf(StorageError);
        expect((error as StorageError).code).toBe('UNAVAILABLE');
      }

      setItemSpy.mockRestore();
      setItemSpy = null;
    });
  });

  describe('loadTodos', () => {
    it('should load saved todos successfully', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Test todo', completed: false, createdAt: 1234567890 },
        { id: '2', text: 'Another todo', completed: true, createdAt: 9876543210 },
      ];

      localStorage.setItem('todos', JSON.stringify(mockTodos));

      const loaded = loadTodos();
      expect(loaded).toEqual(mockTodos);
    });

    it('should load todos with custom storage key', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Test todo', completed: false, createdAt: Date.now() },
      ];
      const customKey = 'custom-todos-key';

      localStorage.setItem(customKey, JSON.stringify(mockTodos));

      const loaded = loadTodos(customKey);
      expect(loaded).toEqual(mockTodos);
    });

    it('should return empty array when no data exists', () => {
      const loaded = loadTodos();
      expect(loaded).toEqual([]);
    });

    it('should return empty array on invalid JSON', () => {
      localStorage.setItem('todos', 'invalid json {');

      const loaded = loadTodos();
      expect(loaded).toEqual([]);
    });

    it('should return empty array when stored data is not an array', () => {
      localStorage.setItem('todos', JSON.stringify({ not: 'an array' }));

      const loaded = loadTodos();
      expect(loaded).toEqual([]);
    });

    it('should return empty array when localStorage is unavailable', () => {
      getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage not available');
      });

      const loaded = loadTodos();
      expect(loaded).toEqual([]);

      getItemSpy.mockRestore();
      getItemSpy = null;
    });

    it('should load empty array successfully', () => {
      localStorage.setItem('todos', JSON.stringify([]));

      const loaded = loadTodos();
      expect(loaded).toEqual([]);
    });
  });

  describe('clearTodos', () => {
    it('should remove todos from localStorage', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Test todo', completed: false, createdAt: Date.now() },
      ];

      localStorage.setItem('todos', JSON.stringify(mockTodos));
      expect(localStorage.getItem('todos')).not.toBeNull();

      clearTodos();

      expect(localStorage.getItem('todos')).toBeNull();
    });

    it('should clear todos with custom storage key', () => {
      const customKey = 'custom-todos-key';
      localStorage.setItem(customKey, JSON.stringify([]));

      clearTodos(customKey);

      expect(localStorage.getItem(customKey)).toBeNull();
    });

    it('should handle errors gracefully when clearing fails', () => {
      removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
      removeItemSpy.mockImplementation(() => {
        throw new Error('Cannot remove');
      });

      expect(() => clearTodos()).not.toThrow();

      removeItemSpy.mockRestore();
      removeItemSpy = null;
    });
  });

  describe('error codes and messages', () => {
    it('should have correct ERROR_MESSAGES for all codes', () => {
      expect(ERROR_MESSAGES.UNAVAILABLE).toBe(
        'Storage is not available. Your todos will not be saved.'
      );
      expect(ERROR_MESSAGES.QUOTA_EXCEEDED).toBe(
        'Storage limit reached. Please delete some todos to free up space.'
      );
      expect(ERROR_MESSAGES.SAVE_ERROR).toBe(
        'Failed to save your changes. Please try again.'
      );
      expect(ERROR_MESSAGES.LOAD_ERROR).toBe(
        'Failed to load your todos. Please refresh the page.'
      );
    });

    it('should create StorageError with correct properties', () => {
      const error = new StorageError('Test message', 'SAVE_ERROR');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(StorageError);
      expect(error.name).toBe('StorageError');
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('SAVE_ERROR');
    });
  });
});
