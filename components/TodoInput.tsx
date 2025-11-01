'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
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
    <div className="mb-8">
      <div className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          maxLength={TODO_CONSTRAINTS.MAX_TEXT_LENGTH}
          className={`flex-1 px-5 py-3.5 backdrop-blur-md bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 text-base shadow-lg transition-all duration-300 placeholder-gray-600 text-gray-800 ${
            error
              ? 'focus:ring-red-400 focus:border-red-300 focus:bg-white/70'
              : 'focus:ring-purple-400 focus:border-purple-300 focus:bg-white/70 hover:bg-white/60'
          }`}
          aria-label="New todo input"
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
        />
        <button
          onClick={handleSubmit}
          disabled={isInputEmpty}
          className={`px-6 py-3.5 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-300 shadow-lg flex items-center gap-2 ${
            isInputEmpty
              ? 'bg-gray-300/50 text-gray-500 cursor-not-allowed backdrop-blur-md'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:scale-105 active:scale-95'
          }`}
          aria-label="Add todo"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>
      {error && (
        <p
          id="input-error"
          className="mt-3 text-sm text-red-600 backdrop-blur-sm bg-white/60 px-3 py-2 rounded-lg animate-fade-in"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
