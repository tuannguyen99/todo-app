'use client';

import { useState, useEffect } from 'react';
import type { Todo, UpdateTodoInput } from '@/types/todo';
import * as todoStorage from '@/lib/services/todoStorage';
import { isValidTodoText } from '@/lib/utils/validation';

/**
 * Custom hook for managing todo state and operations.
 * Provides CRUD operations with automatic localStorage synchronization.
 *
 * @returns Object containing todos array, CRUD functions, and error state
 */
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load todos on mount
  useEffect(() => {
    try {
      const loadedTodos = todoStorage.loadTodos();
      setTodos(loadedTodos);
    } catch (err) {
      if (err instanceof todoStorage.StorageError) {
        if (err.code === 'UNAVAILABLE') {
          setError('Storage is not available. Your todos will not be saved.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to load todos.');
      }
    }
  }, []);

  /**
   * Adds a new todo to the list
   * @param text - The text content for the new todo
   */
  const addTodo = (text: string): void => {
    if (!isValidTodoText(text)) {
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((currentTodos) => {
      const updatedTodos = [newTodo, ...currentTodos];

      try {
        todoStorage.saveTodos(updatedTodos);
        setError(null);
        return updatedTodos;
      } catch (err) {
        if (err instanceof todoStorage.StorageError) {
          setError(err.message);
        } else {
          setError('Failed to save todo');
        }
        // Rollback on error
        return currentTodos;
      }
    });
  };

  /**
   * Updates an existing todo
   * @param id - The id of the todo to update
   * @param updates - Partial todo updates to apply
   */
  const updateTodo = (id: string, updates: UpdateTodoInput): void => {
    setTodos((currentTodos) => {
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      );

      try {
        todoStorage.saveTodos(updatedTodos);
        setError(null);
        return updatedTodos;
      } catch (err) {
        if (err instanceof todoStorage.StorageError) {
          setError(err.message);
        } else {
          setError('Failed to update todo');
        }
        return currentTodos;
      }
    });
  };

  /**
   * Deletes a todo from the list
   * @param id - The id of the todo to delete
   */
  const deleteTodo = (id: string): void => {
    setTodos((currentTodos) => {
      const updatedTodos = currentTodos.filter((todo) => todo.id !== id);

      try {
        todoStorage.saveTodos(updatedTodos);
        setError(null);
        return updatedTodos;
      } catch (err) {
        if (err instanceof todoStorage.StorageError) {
          setError(err.message);
        } else {
          setError('Failed to delete todo');
        }
        return currentTodos;
      }
    });
  };

  /**
   * Toggles the completed status of a todo
   * @param id - The id of the todo to toggle
   */
  const toggleTodo = (id: string): void => {
    setTodos((currentTodos) => {
      const todo = currentTodos.find((t) => t.id === id);
      if (!todo) {
        return currentTodos;
      }

      const updatedTodos = currentTodos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );

      try {
        todoStorage.saveTodos(updatedTodos);
        setError(null);
        return updatedTodos;
      } catch (err) {
        if (err instanceof todoStorage.StorageError) {
          setError(err.message);
        } else {
          setError('Failed to update todo');
        }
        return currentTodos;
      }
    });
  };

  /**
   * Clears the current error message
   */
  const clearError = (): void => setError(null);

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    error,
    clearError,
  };
}
