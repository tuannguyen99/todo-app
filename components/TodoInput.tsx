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
  const [error, setError] = useState('');

  const handleSubmit = (): void => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setError('Please enter a todo');
      return;
    }

    if (isValidTodoText(trimmedValue)) {
      onAddTodo(trimmedValue);
      setInputValue(''); // Clear input on success
      setError(''); // Clear error on success
    }
    // If invalid, do nothing - input remains with current value
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const isInputEmpty = inputValue.trim().length === 0;

  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          maxLength={TODO_CONSTRAINTS.MAX_TEXT_LENGTH}
          className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-base shadow-sm ${
            error
              ? 'border-red-400 focus:ring-red-500 focus:border-red-400'
              : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
          }`}
          aria-label="New todo input"
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
        />
        <button
          onClick={handleSubmit}
          disabled={isInputEmpty}
          className={`px-8 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 shadow-sm ${
            isInputEmpty
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 hover:shadow-md'
          }`}
          aria-label="Add todo"
        >
          Add
        </button>
      </div>
      {error && (
        <p
          id="input-error"
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
