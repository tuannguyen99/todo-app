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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 animate-gradient py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-3 drop-shadow-lg">My Tasks</h1>
          <p className="text-xl text-white/90 drop-shadow">Stay organized and productive with style</p>
        </header>

        <div className="glass-strong rounded-3xl shadow-2xl p-8 animate-scale-in">
          <TodoInput onAddTodo={addTodo} />

          {error && (
            <div className="mb-6 p-4 backdrop-blur-md bg-red-500/20 border border-red-300/50 text-white rounded-xl shadow-lg animate-fade-in">
              {error}
              <button
                onClick={clearError}
                className="ml-2 text-white hover:text-red-100 font-bold transition-colors"
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
