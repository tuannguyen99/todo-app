'use client';

import { CheckCircle2, ListTodo, Clock } from 'lucide-react';
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
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center justify-center gap-6 py-5 px-6 backdrop-blur-md bg-white/30 rounded-2xl border border-white/30 mb-6 shadow-lg animate-fade-in">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ListTodo className="w-5 h-5 text-purple-600" />
          <p className="text-3xl font-bold text-gray-800">{total}</p>
        </div>
        <p className="text-xs text-gray-700 uppercase tracking-wide font-semibold">Total</p>
      </div>
      
      <div className="h-12 w-px bg-white/40"></div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-3xl font-bold text-green-600">{completed}</p>
        </div>
        <p className="text-xs text-gray-700 uppercase tracking-wide font-semibold">
          Completed {percentage > 0 && `(${percentage}%)`}
        </p>
      </div>
      
      <div className="h-12 w-px bg-white/40"></div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-blue-600" />
          <p className="text-3xl font-bold text-blue-600">{pending}</p>
        </div>
        <p className="text-xs text-gray-700 uppercase tracking-wide font-semibold">Pending</p>
      </div>
    </div>
  );
}
