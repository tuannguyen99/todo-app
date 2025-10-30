/**
 * Constants for todo validation and storage configuration
 */
export const TODO_CONSTRAINTS = {
  MIN_TEXT_LENGTH: 1,
  MAX_TEXT_LENGTH: 500,
  STORAGE_KEY: 'todos',
} as const;

/**
 * Validates todo text input
 * @param text - The text to validate
 * @returns true if text is valid (non-empty after trimming and <= 500 characters), false otherwise
 */
export const isValidTodoText = (text: string): boolean => {
  const trimmed = text.trim();
  return (
    trimmed.length >= TODO_CONSTRAINTS.MIN_TEXT_LENGTH &&
    trimmed.length <= TODO_CONSTRAINTS.MAX_TEXT_LENGTH
  );
};
