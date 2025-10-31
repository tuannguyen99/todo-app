# Testing Strategy

### Testing Pyramid

```
      E2E Tests (0%)
      [Deferred post-MVP]
     /                  \
    Integration Tests (20%)
   [Hook + Service tests]
   /                      \
  Unit Tests (80%)
 [Component + Utility tests]
```

### Test Organization

**Frontend Tests:**

```
__tests__/
├── components/
│   ├── TodoApp.test.tsx          # Integration: full app flow
│   ├── TodoInput.test.tsx        # Unit: input validation, events
│   ├── TodoList.test.tsx         # Unit: rendering, sorting
│   ├── TodoItem.test.tsx         # Unit: edit mode, actions
│   ├── Toast.test.tsx            # Unit: display, auto-dismiss
│   └── EmptyState.test.tsx       # Unit: rendering
├── lib/
│   ├── hooks/
│   │   └── useTodos.test.ts      # Integration: CRUD ops
│   └── services/
│       └── todoStorage.test.ts   # Unit: storage operations
└── utils/
    └── validation.test.ts        # Unit: validation logic
```

### Test Examples

**Component Test Example:**

```typescript
// __tests__/components/TodoInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoInput } from '@/components/TodoInput';

describe('TodoInput', () => {
  it('should call onAddTodo with trimmed text on Enter key', () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAddTodo={mockOnAdd} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '  Buy milk  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnAdd).toHaveBeenCalledWith('Buy milk');
    expect(input).toHaveValue(''); // Input cleared
  });

  it('should not call onAddTodo with empty text', () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAddTodo={mockOnAdd} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should call onAddTodo when Add button is clicked', () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAddTodo={mockOnAdd} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('New task');
  });
});
```

**Service Test Example:**

```typescript
// __tests__/lib/services/todoStorage.test.ts
import { todoStorage, StorageError } from '@/lib/services/todoStorage';
import type { Todo } from '@/types/todo';

describe('todoStorage', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      text: 'Test todo',
      completed: false,
      createdAt: Date.now(),
    },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveTodos', () => {
    it('should save todos to localStorage', () => {
      todoStorage.saveTodos(mockTodos);

      const stored = localStorage.getItem('todos');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(mockTodos);
    });

    it('should throw StorageError when quota exceeded', () => {
      // Mock quota exceeded error
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      const quotaError = new DOMException('Quota exceeded', 'QuotaExceededError');
      setItemSpy.mockImplementation(() => {
        throw quotaError;
      });

      expect(() => todoStorage.saveTodos(mockTodos)).toThrow(StorageError);
      expect(() => todoStorage.saveTodos(mockTodos)).toThrow(/quota exceeded/i);

      setItemSpy.mockRestore();
    });
  });

  describe('loadTodos', () => {
    it('should load todos from localStorage', () => {
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      const loaded = todoStorage.loadTodos();
      expect(loaded).toEqual(mockTodos);
    });

    it('should return empty array when no data exists', () => {
      const loaded = todoStorage.loadTodos();
      expect(loaded).toEqual([]);
    });

    it('should return empty array on invalid JSON', () => {
      localStorage.setItem('todos', 'invalid json');

      const loaded = todoStorage.loadTodos();
      expect(loaded).toEqual([]);
    });
  });
});
```

**Hook Test Example:**

```typescript
// __tests__/lib/hooks/useTodos.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '@/lib/hooks/useTodos';

// Mock the storage service
jest.mock('@/lib/services/todoStorage');

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should add a new todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('New task');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('New task');
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('should toggle todo completion', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task to complete');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);
  });

  it('should delete a todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task to delete');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });
});
```
