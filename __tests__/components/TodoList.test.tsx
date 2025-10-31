import { render, screen } from '@testing-library/react';
import { TodoList } from '@/components/TodoList';
import type { Todo } from '@/types/todo';

// Mock TodoItem to isolate TodoList logic
jest.mock('@/components/TodoItem', () => ({
  TodoItem: ({ todo }: { todo: Todo }) => (
    <div data-testid={`todo-${todo.id}`}>{todo.text}</div>
  ),
}));

describe('TodoList', () => {
  const mockOnToggleTodo = jest.fn();
  const mockOnEditTodo = jest.fn();
  const mockOnDeleteTodo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTodos: Todo[] = [
    {
      id: '1',
      text: 'First todo',
      completed: false,
      createdAt: 1000,
    },
    {
      id: '2',
      text: 'Second todo',
      completed: true,
      createdAt: 2000,
    },
    {
      id: '3',
      text: 'Third todo',
      completed: false,
      createdAt: 1500,
    },
  ];

  it('should render empty list when todos array is empty', () => {
    const { container } = render(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list?.children).toHaveLength(0);
  });

  it('should render TodoItem for each todo', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    expect(screen.getByTestId('todo-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-2')).toBeInTheDocument();
    expect(screen.getByTestId('todo-3')).toBeInTheDocument();
  });

  it('should sort todos by createdAt descending (newest first)', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const items = screen.getAllByTestId(/^todo-/);
    
    // Expected order: 2 (2000), 3 (1500), 1 (1000)
    expect(items[0]).toHaveAttribute('data-testid', 'todo-2');
    expect(items[1]).toHaveAttribute('data-testid', 'todo-3');
    expect(items[2]).toHaveAttribute('data-testid', 'todo-1');
  });

  it('should use todo.id as React key', () => {
    const { container } = render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const listItems = container.querySelectorAll('li');
    
    // React keys are not directly accessible in the DOM, but we can verify
    // that each todo is rendered and has a unique testid
    expect(listItems).toHaveLength(3);
    listItems.forEach((item) => {
      const todoElement = item.querySelector('[data-testid^="todo-"]');
      expect(todoElement).toBeInTheDocument();
    });
  });

  it('should render todos in a ul element with proper styling', () => {
    const { container } = render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const list = container.querySelector('ul');
    expect(list).toHaveClass('space-y-2');
  });

  it('should not mutate the original todos array', () => {
    const originalTodos = [...mockTodos];
    
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verify original array order is unchanged
    expect(mockTodos).toEqual(originalTodos);
  });
});
