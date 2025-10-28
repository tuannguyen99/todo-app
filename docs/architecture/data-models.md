# Data Models

The application has one core data model representing a todo item. This model is shared across all components and the local storage layer, ensuring type safety throughout the application.

### Todo

**Purpose:** Represents a single todo item with its text content, completion status, and metadata for ordering and identification.

**Key Attributes:**
- `id`: string - Unique identifier generated via `crypto.randomUUID()`
- `text`: string - The todo item's text content (user-entered)
- `completed`: boolean - Whether the todo has been marked as complete
- `createdAt`: number - Unix timestamp (milliseconds) for sorting and display

**Design Decisions:**
- **UUID as string**: Using native `crypto.randomUUID()` provides guaranteed uniqueness without dependencies
- **Unix timestamp**: Stored as number for efficient sorting and comparison; can be formatted for display as needed
- **Boolean completion**: Simple true/false rather than enum to minimize complexity
- **No updatedAt field**: Not required by PRD; createdAt sufficient for sorting

#### TypeScript Interface

```typescript
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
```

#### Relationships

- **No relationships**: This is a flat data model with no foreign keys or nested structures
- **Storage format**: Todos stored as JSON array in localStorage under key `'todos'`
- **In-memory format**: Array of Todo objects maintained in React state

#### Validation Rules

```typescript
/**
 * Validates todo text input
 */
export const isValidTodoText = (text: string): boolean => {
  return text.trim().length > 0 && text.trim().length <= 500;
};

/**
 * Constants for todo validation
 */
export const TODO_CONSTRAINTS = {
  MIN_TEXT_LENGTH: 1,
  MAX_TEXT_LENGTH: 500,
  STORAGE_KEY: 'todos'
} as const;
```
