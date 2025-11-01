import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '@/lib/hooks/useTodos';
import * as todoStorage from '@/lib/services/todoStorage';
import type { Todo } from '@/types/todo';

// Mock the todoStorage module
jest.mock('@/lib/services/todoStorage', () => ({
  ...jest.requireActual('@/lib/services/todoStorage'),
  saveTodos: jest.fn(),
  loadTodos: jest.fn(),
}));

const mockSaveTodos = todoStorage.saveTodos as jest.MockedFunction<typeof todoStorage.saveTodos>;
const mockLoadTodos = todoStorage.loadTodos as jest.MockedFunction<typeof todoStorage.loadTodos>;

describe('useTodos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadTodos.mockReturnValue([]);
  });

  describe('initialization', () => {
    it('should initialize with empty todos array', () => {
      const { result } = renderHook(() => useTodos());

      expect(result.current.todos).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should load todos from storage on mount', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          text: 'Test todo',
          completed: false,
          createdAt: Date.now(),
        },
      ];
      mockLoadTodos.mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      expect(mockLoadTodos).toHaveBeenCalledTimes(1);
      expect(result.current.todos).toEqual(mockTodos);
    });

    it('should set error when storage is unavailable on mount', () => {
      mockLoadTodos.mockImplementation(() => {
        throw new todoStorage.StorageError('Storage unavailable', 'UNAVAILABLE');
      });

      const { result } = renderHook(() => useTodos());

      expect(result.current.error).toBe('Storage unavailable');
    });

    it('should set generic error for other load errors', () => {
      mockLoadTodos.mockImplementation(() => {
        throw new Error('Unknown error');
      });

      const { result } = renderHook(() => useTodos());

      expect(result.current.error).toBe('Failed to load todos. The app will work, but your todos may not be saved.');
    });
  });

  describe('addTodo', () => {
    it('should add a new todo with valid text', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Buy milk');
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Buy milk');
      expect(result.current.todos[0].completed).toBe(false);
      expect(result.current.todos[0].id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(result.current.todos[0].createdAt).toBeGreaterThan(0);
    });

    it('should trim text before adding todo', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('  Trimmed text  ');
      });

      expect(result.current.todos[0].text).toBe('Trimmed text');
    });

    it('should add new todo to beginning of array', () => {
      const existingTodo: Todo = {
        id: '1',
        text: 'First todo',
        completed: false,
        createdAt: Date.now(),
      };
      mockLoadTodos.mockReturnValue([existingTodo]);

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Second todo');
      });

      expect(result.current.todos).toHaveLength(2);
      expect(result.current.todos[0].text).toBe('Second todo');
      expect(result.current.todos[1].text).toBe('First todo');
    });

    it('should not add todo with empty text', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('');
      });

      expect(result.current.todos).toHaveLength(0);
      expect(mockSaveTodos).not.toHaveBeenCalled();
    });

    it('should not add todo with whitespace-only text', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('   ');
      });

      expect(result.current.todos).toHaveLength(0);
      expect(mockSaveTodos).not.toHaveBeenCalled();
    });

    it('should save todos to storage after adding', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('New task');
      });

      expect(mockSaveTodos).toHaveBeenCalledTimes(1);
      expect(mockSaveTodos).toHaveBeenCalledWith([
        expect.objectContaining({
          text: 'New task',
          completed: false,
        }),
      ]);
    });

    it('should set error on storage failure', () => {
      mockSaveTodos.mockImplementation(() => {
        throw new todoStorage.StorageError('Quota exceeded', 'QUOTA_EXCEEDED');
      });

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('New task');
      });

      expect(result.current.error).toBe('Quota exceeded');
    });

    it('should rollback on storage error', () => {
      const existingTodo: Todo = {
        id: '1',
        text: 'Existing',
        completed: false,
        createdAt: Date.now(),
      };
      mockLoadTodos.mockReturnValue([existingTodo]);
      mockSaveTodos.mockImplementation(() => {
        throw new todoStorage.StorageError('Save failed', 'SAVE_ERROR');
      });

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('New task');
      });

      // Should rollback to original state
      expect(result.current.todos).toEqual([existingTodo]);
    });

    it('should handle generic save errors', () => {
      mockSaveTodos.mockImplementation(() => {
        throw new Error('Unknown error');
      });

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('New task');
      });

      expect(result.current.error).toBe('Failed to save todo');
    });

    it('should clear error on successful add after previous error', () => {
      mockSaveTodos.mockImplementationOnce(() => {
        throw new todoStorage.StorageError('Error', 'SAVE_ERROR');
      });

      const { result } = renderHook(() => useTodos());

      // First add fails
      act(() => {
        result.current.addTodo('First');
      });
      expect(result.current.error).toBeTruthy();

      // Reset mock
      mockSaveTodos.mockImplementation(() => {});

      // Second add succeeds
      act(() => {
        result.current.addTodo('Second');
      });
      expect(result.current.error).toBeNull();
    });
  });

  describe('updateTodo', () => {
    it('should update todo text', () => {
      const existingTodo: Todo = {
        id: '1',
        text: 'Original',
        completed: false,
        createdAt: Date.now(),
      };
      mockLoadTodos.mockReturnValue([existingTodo]);

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.updateTodo('1', { text: 'Updated' });
      });

      expect(result.current.todos[0].text).toBe('Updated');
    });

    it('should update todo completed status', () => {
      const existingTodo: Todo = {
        id: '1',
        text: 'Task',
        completed: false,
        createdAt: Date.now(),
      };
      mockLoadTodos.mockReturnValue([existingTodo]);

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.updateTodo('1', { completed: true });
      });

      expect(result.current.todos[0].completed).toBe(true);
    });

    it('should save to storage after update', () => {
      const existingTodo: Todo = {
        id: '1',
        text: 'Task',
        completed: false,
        createdAt: Date.now(),
      };
      mockLoadTodos.mockReturnValue([existingTodo]);

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.updateTodo('1', { completed: true });
      });

      expect(mockSaveTodos).toHaveBeenCalledWith([expect.objectContaining({ completed: true })]);
    });

    it('should rollback on storage error', () => {
      const existingTodo: Todo = {
        id: '1',
        text: 'Task',
        completed: false,
        createdAt: Date.now(),
      };
      mockLoadTodos.mockReturnValue([existingTodo]);
      mockSaveTodos.mockImplementation(() => {
        throw new todoStorage.StorageError('Error', 'SAVE_ERROR');
      });

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.updateTodo('1', { completed: true });
      });

      expect(result.current.todos[0].completed).toBe(false);
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo by id', async () => {
      const todos: Todo[] = [
        { id: '1', text: 'First', completed: false, createdAt: Date.now() },
        { id: '2', text: 'Second', completed: false, createdAt: Date.now() },
      ];
      mockLoadTodos.mockReturnValue(todos);
      mockSaveTodos.mockImplementation(() => {}); // Ensure it doesn't throw

      const { result } = renderHook(() => useTodos());

      await act(async () => {
        result.current.deleteTodo('1');
      });

      await waitFor(() => {
        expect(result.current.todos).toHaveLength(1);
      });
      expect(result.current.todos[0].id).toBe('2');
    });

    it('should save to storage after delete', () => {
      const todos: Todo[] = [{ id: '1', text: 'Task', completed: false, createdAt: Date.now() }];
      mockLoadTodos.mockReturnValue(todos);

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.deleteTodo('1');
      });

      expect(mockSaveTodos).toHaveBeenCalledWith([]);
    });

    it('should rollback on storage error', () => {
      const todos: Todo[] = [{ id: '1', text: 'Task', completed: false, createdAt: Date.now() }];
      mockLoadTodos.mockReturnValue(todos);
      mockSaveTodos.mockImplementation(() => {
        throw new todoStorage.StorageError('Error', 'SAVE_ERROR');
      });

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.deleteTodo('1');
      });

      expect(result.current.todos).toEqual(todos);
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completed status', async () => {
      const existingTodo: Todo = {
        id: '1',
        text: 'Task',
        completed: false,
        createdAt: Date.now(),
      };
      mockLoadTodos.mockReturnValue([existingTodo]);
      mockSaveTodos.mockImplementation(() => {}); // Ensure it doesn't throw

      const { result } = renderHook(() => useTodos());

      await act(async () => {
        result.current.toggleTodo('1');
      });

      await waitFor(() => {
        expect(result.current.todos[0].completed).toBe(true);
      });

      await act(async () => {
        result.current.toggleTodo('1');
      });

      await waitFor(() => {
        expect(result.current.todos[0].completed).toBe(false);
      });
    });

    it('should handle non-existent todo id', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.toggleTodo('non-existent');
      });

      // Should not throw error
      expect(result.current.todos).toEqual([]);
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      mockSaveTodos.mockImplementation(() => {
        throw new todoStorage.StorageError('Error', 'SAVE_ERROR');
      });

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Task');
      });
      expect(result.current.error).toBeTruthy();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
