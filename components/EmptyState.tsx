'use client';

/**
 * Welcoming view when no todos exist.
 * Encourages users to add their first todo.
 * 
 * @returns EmptyState component
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-lg text-gray-600">
        No todos yet! Add one above to get started 🎯
      </p>
    </div>
  );
}
