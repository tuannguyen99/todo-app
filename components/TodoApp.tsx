'use client';

import { TodoInput } from '@/components/TodoInput';
import { TodoList } from '@/components/TodoList';
import { EmptyState } from '@/components/EmptyState';
import { useTodos } from '@/lib/hooks/useTodos';

/**
 * Main application container component.
 * Manages global todo state and coordinates all child components.
 *
 * @returns TodoApp component
 */
export function TodoApp() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, error, clearError } = useTodos();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Todo List</h1>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          <TodoInput onAddTodo={addTodo} />

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <button
                onClick={clearError}
                className="ml-2 text-red-800 hover:text-red-900 font-bold"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {todos.length === 0 ? (
            <EmptyState />
          ) : (
            <TodoList
              todos={todos}
              onToggleTodo={toggleTodo}
              onEditTodo={(id, text) => updateTodo(id, { text })}
              onDeleteTodo={deleteTodo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
