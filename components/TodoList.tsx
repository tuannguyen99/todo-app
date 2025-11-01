'use client';

import { TodoItem } from '@/components/TodoItem';
import type { Todo } from '@/types/todo';

/**
 * Props for TodoList component
 */
interface TodoListProps {
  /** Array of todos to display */
  todos: Todo[];
  /** Callback when a todo's checkbox is toggled */
  onToggleTodo: (id: string) => void;
  /** Callback when a todo's text is edited */
  onEditTodo: (id: string, text: string) => void;
  /** Callback when a todo is deleted */
  onDeleteTodo: (id: string) => void;
}

/**
 * Renders a list of TodoItem components.
 * Handles sorting and provides callbacks to child items.
 * 
 * @param props - Component props
 * @returns TodoList component
 */
export function TodoList({ todos, onToggleTodo, onEditTodo, onDeleteTodo }: TodoListProps) {
  // Sort todos by createdAt (newest first)
  const sortedTodos = [...todos].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <ul className="space-y-3">
      {sortedTodos.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            onToggle={() => onToggleTodo(todo.id)}
            onEdit={(text: string) => onEditTodo(todo.id, text)}
            onDelete={() => onDeleteTodo(todo.id)}
          />
        </li>
      ))}
    </ul>
  );
}
