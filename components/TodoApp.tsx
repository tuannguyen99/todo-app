'use client';

import { TodoInput } from '@/components/TodoInput';
import { TodoList } from '@/components/TodoList';
import { EmptyState } from '@/components/EmptyState';
import { TodoStats } from '@/components/TodoStats';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <header className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900 text-center mb-2">Todo List</h1>
          <p className="text-center text-gray-600">Stay organized and productive</p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <TodoInput onAddTodo={addTodo} />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm">
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
            <>
              <TodoStats todos={todos} />
              <TodoList
                todos={todos}
                onToggleTodo={toggleTodo}
                onEditTodo={(id, text) => updateTodo(id, { text })}
                onDeleteTodo={deleteTodo}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
