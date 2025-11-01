'use client';

import type { Todo } from '@/types/todo';

/**
 * Props for TodoStats component
 */
interface TodoStatsProps {
  /** Array of todos to calculate statistics from */
  todos: Todo[];
}

/**
 * Displays statistics about todos: total count, completed count, and pending count.
 * 
 * @param props - Component props
 * @returns TodoStats component
 */
export function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;

  return (
    <div className="flex items-center justify-center gap-6 py-4 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 mb-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">{total}</p>
        <p className="text-xs text-gray-600 uppercase tracking-wide">Total</p>
      </div>
      <div className="h-10 w-px bg-gray-300"></div>
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">{completed}</p>
        <p className="text-xs text-gray-600 uppercase tracking-wide">Completed</p>
      </div>
      <div className="h-10 w-px bg-gray-300"></div>
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-600">{pending}</p>
        <p className="text-xs text-gray-600 uppercase tracking-wide">Pending</p>
      </div>
    </div>
  );
}
