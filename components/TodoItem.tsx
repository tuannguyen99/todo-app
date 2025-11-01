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
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleCancel}
          className="flex-1 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          aria-label="Edit todo text"
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={`flex-1 cursor-pointer ${
            todo.completed
              ? 'line-through text-gray-500'
              : 'text-gray-900'
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
        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
        aria-label={`Delete "${todo.text}"`}
      >
        Delete
      </button>
    </div>
  );
}
