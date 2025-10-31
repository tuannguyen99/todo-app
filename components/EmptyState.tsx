'use client';

/**
 * Welcoming view when no todos exist.
 * Encourages users to add their first todo.
 * 
 * @returns EmptyState component
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4">📝</div>
      <p className="text-xl text-gray-600 mb-2">No todos yet</p>
      <p className="text-sm text-gray-500">
        Add one above to get started!
      </p>
    </div>
  );
}
