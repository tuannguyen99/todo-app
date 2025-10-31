'use client';

import { TodoInput } from '@/components/TodoInput';
import { useTodos } from '@/lib/hooks/useTodos';

/**
 * Main application container component.
 * Manages global todo state and coordinates all child components.
 *
 * @returns TodoApp component
 */
export function TodoApp() {
  const { todos, addTodo, error, clearError } = useTodos();

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

          {/* Temporary todo display for Story 1.3 verification */}
          {/* Will be replaced by TodoList component in Story 1.4 */}
          <div className="space-y-2">
            {todos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No todos yet. Add one above to get started!
              </p>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li key={todo.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-900">{todo.text}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {todo.completed ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      ID: {todo.id.substring(0, 8)}... | Created:{' '}
                      {new Date(todo.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
