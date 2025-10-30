import { Todo } from '@/types/todo';
import { TODO_CONSTRAINTS } from '@/lib/utils/validation';

/**
 * Error codes for storage operations
 */
export type StorageErrorCode = 'UNAVAILABLE' | 'QUOTA_EXCEEDED' | 'SAVE_ERROR' | 'LOAD_ERROR';

/**
 * Custom error class for storage operations
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: StorageErrorCode
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * User-friendly error messages mapped to error codes
 */
export const ERROR_MESSAGES = {
  UNAVAILABLE: 'Storage is not available. Your todos will not be saved.',
  QUOTA_EXCEEDED: 'Storage limit reached. Please delete some todos to free up space.',
  SAVE_ERROR: 'Failed to save your changes. Please try again.',
  LOAD_ERROR: 'Failed to load your todos. Please refresh the page.',
} as const;

/**
 * Checks if localStorage is available in the current environment
 * @returns true if localStorage is available and functional, false otherwise
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Saves todos array to localStorage
 * @param todos - Array of todo items to save
 * @param key - Storage key to use (defaults to TODO_CONSTRAINTS.STORAGE_KEY)
 * @throws {StorageError} When storage is unavailable, quota is exceeded, or save fails
 */
export const saveTodos = (todos: Todo[], key: string = TODO_CONSTRAINTS.STORAGE_KEY): void => {
  try {
    const serialized = JSON.stringify(todos);
    localStorage.setItem(key, serialized);
  } catch (error) {
    // Check for quota exceeded error
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' || error.code === 22)
    ) {
      throw new StorageError(ERROR_MESSAGES.QUOTA_EXCEEDED, 'QUOTA_EXCEEDED');
    }

    // Check if storage is unavailable
    if (!isStorageAvailable()) {
      throw new StorageError(ERROR_MESSAGES.UNAVAILABLE, 'UNAVAILABLE');
    }

    throw new StorageError(ERROR_MESSAGES.SAVE_ERROR, 'SAVE_ERROR');
  }
};

/**
 * Loads todos array from localStorage
 * @param key - Storage key to use (defaults to TODO_CONSTRAINTS.STORAGE_KEY)
 * @returns Array of todo items, or empty array if no data exists or on error
 */
export const loadTodos = (key: string = TODO_CONSTRAINTS.STORAGE_KEY): Todo[] => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    
    // Validate structure - should be an array
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as Todo[];
  } catch (error) {
    // JSON parse errors should return empty array (graceful degradation)
    if (error instanceof SyntaxError) {
      return [];
    }

    // For any other errors, return empty array for graceful degradation
    // This ensures the app remains functional even when storage is unavailable
    return [];
  }
};

/**
 * Clears todos from localStorage
 * @param key - Storage key to use (defaults to TODO_CONSTRAINTS.STORAGE_KEY)
 */
export const clearTodos = (key: string = TODO_CONSTRAINTS.STORAGE_KEY): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail - clearing is not critical
  }
};
