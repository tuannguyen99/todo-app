'use client';

import { ClipboardList } from 'lucide-react';

/**
 * Welcoming view when no todos exist.
 * Encourages users to add their first todo.
 * 
 * @returns EmptyState component
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="backdrop-blur-md bg-white/20 rounded-full p-6 mb-4 animate-pulse-soft">
        <ClipboardList className="w-16 h-16 text-purple-600" />
      </div>
      <p className="text-xl font-semibold text-gray-800 mb-2">
        No tasks yet
      </p>
      <p className="text-base text-gray-700">
        Add one to get started and stay productive! ✨
      </p>
    </div>
  );
}
