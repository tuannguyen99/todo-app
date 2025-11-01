'use client';

import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
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
    <div className={`flex items-center gap-4 p-5 backdrop-blur-md bg-white/40 rounded-xl border border-white/30 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-white/50 animate-fade-in ${
      todo.completed ? 'opacity-70' : ''
    }`}>
      {/* Custom Checkbox */}
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
          todo.completed
            ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 shadow-md'
            : 'border-gray-400 hover:border-purple-400 bg-white/50'
        }`}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      >
        {todo.completed && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 backdrop-blur-md bg-white/70 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-base text-gray-800"
            autoFocus
            aria-label="Edit todo text"
          />
          <button
            onClick={handleSave}
            className="p-2 text-green-600 hover:bg-green-100/50 rounded-lg transition-all duration-200"
            aria-label="Save changes"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-600 hover:bg-gray-100/50 rounded-lg transition-all duration-200"
            aria-label="Cancel editing"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 text-base cursor-pointer transition-all duration-300 ${
              todo.completed
                ? 'line-through text-gray-500'
                : 'text-gray-800'
            }`}
            role="button"
            tabIndex={0}
            aria-label={`Todo: "${todo.text}"`}
          >
            {todo.text}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-purple-600 hover:bg-purple-100/50 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label={`Edit "${todo.text}"`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:bg-red-100/50 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label={`Delete "${todo.text}"`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
