import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '@/components/TodoItem';
import type { Todo } from '@/types/todo';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    text: 'Test todo',
    completed: false,
    createdAt: Date.now(),
  };

  const mockOnToggle = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Display Mode', () => {
    it('should render checkbox, text, edit button, and delete button', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('button', { name: /mark.*complete/i })).toBeInTheDocument();
      expect(screen.getByText('Test todo')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should call onToggle when checkbox is clicked', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const checkbox = screen.getByRole('button', { name: /mark.*complete/i });
      fireEvent.click(checkbox);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when delete button is clicked', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('should apply strikethrough style when todo is completed', () => {
      const completedTodo = { ...mockTodo, completed: true };
      render(
        <TodoItem
          todo={completedTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const text = screen.getByText(completedTodo.text);
      expect(text).toHaveClass('line-through');
    });

    it('should apply muted color when todo is completed', () => {
      const completedTodo = { ...mockTodo, completed: true };
      render(
        <TodoItem
          todo={completedTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const text = screen.getByText(completedTodo.text);
      expect(text).toHaveClass('text-gray-500');
    });

    it('should not have strikethrough when todo is not completed', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const text = screen.getByText(mockTodo.text);
      expect(text).not.toHaveClass('line-through');
      expect(text).toHaveClass('text-gray-800');
    });

    it('should have proper ARIA label for checkbox', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const checkbox = screen.getByRole('button', { name: /mark.*complete/i });
      expect(checkbox).toHaveAttribute(
        'aria-label',
        'Mark "Test todo" as complete'
      );
    });

    it('should have proper ARIA label for delete button', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toHaveAttribute('aria-label', 'Delete "Test todo"');
    });

    it('should have proper ARIA label for todo text', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const text = screen.getByText('Test todo');
      expect(text).toHaveAttribute('aria-label', 'Todo: "Test todo"');
    });
  });

  describe('Edit Mode', () => {
    it('should enter edit mode when edit button is clicked', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      // Should show inline input field and save/cancel buttons
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should pre-fill input with current todo text', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Test todo');
    });

    it('should call onEdit with new text when Enter is pressed', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // Enter edit mode by clicking edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Updated text{Enter}');

      expect(mockOnEdit).toHaveBeenCalledWith('Updated text');
    });

    it('should call onEdit with new text when Save button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // Enter edit mode by clicking edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Updated text');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      expect(mockOnEdit).toHaveBeenCalledWith('Updated text');
    });

    it('should exit edit mode without saving when Escape is pressed', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // Enter edit mode by clicking edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Changed text');
      await user.keyboard('{Escape}');

      expect(mockOnEdit).not.toHaveBeenCalled();
      // Should be back in display mode
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });

    it('should exit edit mode without saving when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // Enter edit mode by clicking edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Changed text');

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnEdit).not.toHaveBeenCalled();
      // Should be back in display mode with original text
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });

    it('should not call onEdit if text is unchanged', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // Enter edit mode by clicking edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Press Enter without changing text
      const input = screen.getByRole('textbox');
      await user.keyboard('{Enter}');

      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('should not call onEdit if text is only whitespace', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // Enter edit mode by clicking edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, '   {Enter}');

      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('should trim whitespace before saving', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // Enter edit mode by clicking edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, '  Trimmed text  {Enter}');

      expect(mockOnEdit).toHaveBeenCalledWith('Trimmed text');
    });

    it('should have proper ARIA label for edit input', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // Enter edit mode by clicking edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Edit todo text');
    });
  });
});
