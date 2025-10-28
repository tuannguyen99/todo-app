# Frontend Architecture

### Component Organization Pattern

Components follow a **functional component with hooks** pattern. All components are organized by feature/responsibility rather than type.

**Component Template Example:**

```typescript
'use client';

import { useState } from 'react';
import type { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onEdit: (text: string) => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // Component logic here...

  return (
    <div className="flex items-center gap-2 p-4">
      {/* Component JSX here... */}
    </div>
  );
}
```

### State Management Architecture

The application uses **local component state** with **React hooks** for state management. State is lifted to the appropriate level based on which components need access.

**State Structure:**

```typescript
// TodoApp component state (top level)
interface TodoAppState {
  todos: Todo[];           // Managed by useTodos hook
  error: string | null;    // Managed by useTodos hook
}

// TodoItem component state (component level)
interface TodoItemState {
  isEditing: boolean;
  editText: string;
}

// TodoInput component state (component level)
interface TodoInputState {
  inputValue: string;
}
```

**State Management Patterns:**

- **Lifting State Up:** Todo array state lives in TodoApp (via useTodos), passed down as props
- **Local State:** UI-specific state (editing mode, input values) stays in respective components
- **Prop Drilling:** Acceptable for this shallow component tree (max 2-3 levels deep)
- **No Context API:** Not needed for this small scope; would add unnecessary complexity

### Routing Architecture

**Route Organization:**

Since this is a single-page application, routing is minimal:

```
app/
├── layout.tsx          # Root layout (wraps all pages)
├── page.tsx            # Home route (/) - renders TodoApp
└── error.tsx           # Error boundary
```

**No Dynamic Routes:** Application has a single view, no need for Next.js dynamic routing features.

### Service Layer Architecture

**localStorage Service Implementation:**

```typescript
// lib/services/todoStorage.ts
import type { Todo } from '@/types/todo';
import { TODO_CONSTRAINTS } from '@/types/todo';

export class StorageError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export const todoStorage = {
  loadTodos(): Todo[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        throw new StorageError('localStorage not available', 'UNAVAILABLE');
      }

      const data = localStorage.getItem(TODO_CONSTRAINTS.STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      
      // Validate structure
      if (!Array.isArray(parsed)) {
        console.warn('Invalid todos data structure, resetting');
        return [];
      }

      return parsed as Todo[];
    } catch (error) {
      if (error instanceof StorageError) throw error;
      console.error('Error loading todos:', error);
      return [];
    }
  },

  saveTodos(todos: Todo[]): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        throw new StorageError('localStorage not available', 'UNAVAILABLE');
      }

      const data = JSON.stringify(todos);
      localStorage.setItem(TODO_CONSTRAINTS.STORAGE_KEY, data);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new StorageError(
          'Storage quota exceeded. Please delete some todos.',
          'QUOTA_EXCEEDED'
        );
      }
      throw new StorageError('Failed to save todos', 'SAVE_ERROR');
    }
  },

  clearTodos(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      localStorage.removeItem(TODO_CONSTRAINTS.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing todos:', error);
    }
  }
};
```

**useTodos Hook Implementation:**

```typescript
// lib/hooks/useTodos.ts
import { useState, useEffect } from 'react';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';
import { todoStorage, StorageError } from '@/services/todoStorage';
import { isValidTodoText } from '@/utils/validation';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load todos on mount
  useEffect(() => {
    try {
      const loadedTodos = todoStorage.loadTodos();
      setTodos(loadedTodos);
    } catch (err) {
      if (err instanceof StorageError && err.code === 'UNAVAILABLE') {
        setError('Storage is not available. Your todos will not be saved.');
      } else {
        setError('Failed to load todos.');
      }
    }
  }, []);

  const addTodo = (text: string) => {
    if (!isValidTodoText(text)) {
      setError('Invalid todo text');
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    };

    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);

    try {
      todoStorage.saveTodos(updatedTodos);
      setError(null);
    } catch (err) {
      setError(err instanceof StorageError ? err.message : 'Failed to save todo');
      // Rollback on error
      setTodos(todos);
    }
  };

  const updateTodo = (id: string, updates: UpdateTodoInput) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    setTodos(updatedTodos);

    try {
      todoStorage.saveTodos(updatedTodos);
      setError(null);
    } catch (err) {
      setError(err instanceof StorageError ? err.message : 'Failed to update todo');
      setTodos(todos);
    }
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);

    try {
      todoStorage.saveTodos(updatedTodos);
      setError(null);
    } catch (err) {
      setError(err instanceof StorageError ? err.message : 'Failed to delete todo');
      setTodos(todos);
    }
  };

  const toggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      updateTodo(id, { completed: !todo.completed });
    }
  };

  const clearError = () => setError(null);

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    error,
    clearError
  };
}
```
