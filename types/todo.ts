/**
 * Represents a single todo item in the application.
 * This is the core data model used throughout the app.
 */
export interface Todo {
  /** Unique identifier (UUID v4) */
  id: string;

  /** User-entered todo text content */
  text: string;

  /** Whether the todo is marked as complete */
  completed: boolean;

  /** Creation timestamp in milliseconds since Unix epoch */
  createdAt: number;
}

/**
 * Type for creating a new todo (omits id and createdAt which are auto-generated)
 */
export type CreateTodoInput = Pick<Todo, 'text'>;

/**
 * Type for updating a todo (allows partial updates)
 */
export type UpdateTodoInput = Partial<Pick<Todo, 'text' | 'completed'>>;
