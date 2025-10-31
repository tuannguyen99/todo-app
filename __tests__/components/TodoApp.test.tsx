import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoApp } from '@/components/TodoApp';
import * as useTodosModule from '@/lib/hooks/useTodos';
import type { Todo } from '@/types/todo';

// Mock the useTodos hook
jest.mock('@/lib/hooks/useTodos');

// Mock child components to isolate TodoApp logic
jest.mock('@/components/TodoList', () => ({
  TodoList: ({ todos, onToggleTodo, onEditTodo, onDeleteTodo }: any) => (
    <div data-testid="todo-list">
      {todos.map((todo: Todo) => (
        <div key={todo.id} data-testid={`todo-${todo.id}`}>
          <span>{todo.text}</span>
          <button onClick={() => onToggleTodo(todo.id)}>Toggle</button>
          <button onClick={() => onEditTodo(todo.id, 'edited')}>Edit</button>
          <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock('@/components/EmptyState', () => ({
  EmptyState: () => <div data-testid="empty-state">No todos yet</div>,
}));

const mockUseTodos = useTodosModule.useTodos as jest.MockedFunction<typeof useTodosModule.useTodos>;

describe('TodoApp', () => {
  const mockAddTodo = jest.fn();
  const mockUpdateTodo = jest.fn();
  const mockDeleteTodo = jest.fn();
  const mockToggleTodo = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    mockUseTodos.mockReturnValue({
      todos: [],
      addTodo: mockAddTodo,
      updateTodo: mockUpdateTodo,
      deleteTodo: mockDeleteTodo,
      toggleTodo: mockToggleTodo,
      error: null,
      clearError: mockClearError,
    });
  });

  describe('rendering', () => {
    it('should render TodoInput component', () => {
      render(<TodoApp />);

      const input = screen.getByRole('textbox', { name: /new todo input/i });
      const button = screen.getByRole('button', { name: /add todo/i });

      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('should render app title', () => {
      render(<TodoApp />);

      const title = screen.getByRole('heading', { name: /todo list/i });
      expect(title).toBeInTheDocument();
    });

    it('should display empty state message when no todos', () => {
      render(<TodoApp />);

      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveTextContent(/no todos yet/i);
    });

    it('should display todos in list', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          text: 'First todo',
          completed: false,
          createdAt: Date.now(),
        },
        {
          id: '2',
          text: 'Second todo',
          completed: true,
          createdAt: Date.now(),
        },
      ];

      mockUseTodos.mockReturnValue({
        todos: mockTodos,
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        toggleTodo: mockToggleTodo,
        error: null,
        clearError: mockClearError,
      });

      render(<TodoApp />);

      expect(screen.getByTestId('todo-list')).toBeInTheDocument();
      expect(screen.getByText('First todo')).toBeInTheDocument();
      expect(screen.getByText('Second todo')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    });

    it('should display todo completion status', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          text: 'Completed todo',
          completed: true,
          createdAt: Date.now(),
        },
        {
          id: '2',
          text: 'Incomplete todo',
          completed: false,
          createdAt: Date.now(),
        },
      ];

      mockUseTodos.mockReturnValue({
        todos: mockTodos,
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        toggleTodo: mockToggleTodo,
        error: null,
        clearError: mockClearError,
      });

      render(<TodoApp />);

      expect(screen.getByText('Completed todo')).toBeInTheDocument();
      expect(screen.getByText('Incomplete todo')).toBeInTheDocument();
    });

    it('should display todo id and created timestamp', () => {
      const createdAt = Date.now();
      const mockTodos: Todo[] = [
        {
          id: 'abc12345-1234-4567-8901-123456789012',
          text: 'Test todo',
          completed: false,
          createdAt,
        },
      ];

      mockUseTodos.mockReturnValue({
        todos: mockTodos,
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        toggleTodo: mockToggleTodo,
        error: null,
        clearError: mockClearError,
      });

      render(<TodoApp />);

      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });
  });

  describe('adding todos', () => {
    it('should call addTodo when TodoInput submits', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'New task');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockAddTodo).toHaveBeenCalledWith('New task');
    });

    it('should show newly added todo in list immediately', () => {
      const { rerender } = render(<TodoApp />);

      // Simulate adding a todo
      const newTodo: Todo = {
        id: '1',
        text: 'New task',
        completed: false,
        createdAt: Date.now(),
      };

      mockUseTodos.mockReturnValue({
        todos: [newTodo],
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        toggleTodo: mockToggleTodo,
        error: null,
        clearError: mockClearError,
      });

      rerender(<TodoApp />);

      expect(screen.getByText('New task')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should display error message when error exists', () => {
      mockUseTodos.mockReturnValue({
        todos: [],
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        toggleTodo: mockToggleTodo,
        error: 'Storage is not available',
        clearError: mockClearError,
      });

      render(<TodoApp />);

      const errorMessage = screen.getByText('Storage is not available');
      expect(errorMessage).toBeInTheDocument();
    });

    it('should not display error message when error is null', () => {
      render(<TodoApp />);

      const errorContainer = screen.queryByText(/storage/i);
      expect(errorContainer).not.toBeInTheDocument();
    });

    it('should call clearError when dismiss button is clicked', async () => {
      const user = userEvent.setup();

      mockUseTodos.mockReturnValue({
        todos: [],
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        toggleTodo: mockToggleTodo,
        error: 'Test error',
        clearError: mockClearError,
      });

      render(<TodoApp />);

      const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
      await user.click(dismissButton);

      expect(mockClearError).toHaveBeenCalledTimes(1);
    });
  });

  describe('todo list display', () => {
    it('should display multiple todos', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Task 1', completed: false, createdAt: Date.now() },
        { id: '2', text: 'Task 2', completed: false, createdAt: Date.now() },
        { id: '3', text: 'Task 3', completed: true, createdAt: Date.now() },
      ];

      mockUseTodos.mockReturnValue({
        todos: mockTodos,
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        toggleTodo: mockToggleTodo,
        error: null,
        clearError: mockClearError,
      });

      render(<TodoApp />);

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    it('should display todos in correct order (newest first)', () => {
      const mockTodos: Todo[] = [
        { id: '2', text: 'Newer task', completed: false, createdAt: Date.now() + 1000 },
        { id: '1', text: 'Older task', completed: false, createdAt: Date.now() },
      ];

      mockUseTodos.mockReturnValue({
        todos: mockTodos,
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        toggleTodo: mockToggleTodo,
        error: null,
        clearError: mockClearError,
      });

      render(<TodoApp />);

      expect(screen.getByText('Newer task')).toBeInTheDocument();
      expect(screen.getByText('Older task')).toBeInTheDocument();
    });

    it('should display EmptyState when no todos exist', () => {
      render(<TodoApp />);

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();
    });

    it('should display TodoList when todos exist', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Test todo', completed: false, createdAt: Date.now() },
      ];

      mockUseTodos.mockReturnValue({
        todos: mockTodos,
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        toggleTodo: mockToggleTodo,
        error: null,
        clearError: mockClearError,
      });

      render(<TodoApp />);

      expect(screen.getByTestId('todo-list')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    });

    it('should pass correct callbacks to TodoList', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Test todo', completed: false, createdAt: Date.now() },
      ];

      mockUseTodos.mockReturnValue({
        todos: mockTodos,
        addTodo: mockAddTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
        toggleTodo: mockToggleTodo,
        error: null,
        clearError: mockClearError,
      });

      render(<TodoApp />);

      // Click toggle button
      const toggleButton = screen.getByText('Toggle');
      fireEvent.click(toggleButton);
      expect(mockToggleTodo).toHaveBeenCalledWith('1');

      // Click edit button
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);
      expect(mockUpdateTodo).toHaveBeenCalledWith('1', { text: 'edited' });

      // Click delete button
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
      expect(mockDeleteTodo).toHaveBeenCalledWith('1');
    });
  });
});
