'use client';

import { useState } from 'react';
import type { Todo } from '@/types/todo';

/**
 * Props for TodoItem component
 */
interface TodoItemProps {
  /** The todo item to display */
  todo: Todo;
  /** Callback when checkbox is toggled */
  onToggle: () => void;
  /** Callback when todo text is edited */
  onEdit: (text: string) => void;
  /** Callback when delete button is clicked */
  onDelete: () => void;
}

/**
 * Displays a single todo with checkbox, text, edit, and delete buttons.
 * Manages inline editing state for text modifications.
 * 
 * @param props - Component props
 * @returns TodoItem component
 */
export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      onEdit(trimmedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text); // Revert to original
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleCancel}
          className="flex-1 px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          autoFocus
          aria-label="Edit todo text"
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={`flex-1 cursor-pointer text-base ${
            todo.completed
              ? 'line-through text-gray-400'
              : 'text-gray-800'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsEditing(true);
            }
          }}
          aria-label={`Double-click to edit "${todo.text}"`}
        >
          {todo.text}
        </span>
      )}
      <button
        onClick={onDelete}
        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-150 border border-transparent hover:border-red-200"
        aria-label={`Delete "${todo.text}"`}
      >
        Delete
      </button>
    </div>
  );
}
