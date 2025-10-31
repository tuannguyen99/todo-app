'use client';

import { useState } from 'react';
import { isValidTodoText, TODO_CONSTRAINTS } from '@/lib/utils/validation';

/**
 * Props for TodoInput component
 */
interface TodoInputProps {
  /** Callback function called when a valid todo is submitted */
  onAddTodo: (text: string) => void;
}

/**
 * Input field and submit button for adding new todos.
 * Handles text input validation and Enter key submission.
 *
 * @param props - Component props
 * @returns TodoInput component
 */
export function TodoInput({ onAddTodo }: TodoInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (): void => {
    const trimmedValue = inputValue.trim();

    if (isValidTodoText(trimmedValue)) {
      onAddTodo(trimmedValue);
      setInputValue(''); // Clear input on success
    }
    // If invalid, do nothing - input remains with current value
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        maxLength={TODO_CONSTRAINTS.MAX_TEXT_LENGTH}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="New todo input"
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        aria-label="Add todo"
      >
        Add
      </button>
    </div>
  );
}
