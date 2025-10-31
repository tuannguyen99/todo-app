import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '@/components/TodoInput';
import { TODO_CONSTRAINTS } from '@/lib/utils/validation';

describe('TodoInput', () => {
  let mockOnAddTodo: jest.Mock;

  beforeEach(() => {
    mockOnAddTodo = jest.fn();
  });

  describe('rendering', () => {
    it('should render input field and add button', () => {
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox', { name: /new todo input/i });
      const button = screen.getByRole('button', { name: /add todo/i });

      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('should have correct placeholder text', () => {
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByPlaceholderText('What needs to be done?');
      expect(input).toBeInTheDocument();
    });

    it('should have maxLength attribute of 500', () => {
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', String(TODO_CONSTRAINTS.MAX_TEXT_LENGTH));
    });

    it('should have proper ARIA labels for accessibility', () => {
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByLabelText('New todo input');
      const button = screen.getByLabelText('Add todo');

      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  });

  describe('Enter key submission', () => {
    it('should call onAddTodo with trimmed text on Enter key', async () => {
      const user = userEvent.setup();
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '  Buy milk  ');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnAddTodo).toHaveBeenCalledWith('Buy milk');
      expect(input).toHaveValue('');
    });

    it('should clear input after Enter key submission', async () => {
      const user = userEvent.setup();
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'New task');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).toHaveValue('');
    });

    it('should not call onAddTodo with empty text on Enter', async () => {
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnAddTodo).not.toHaveBeenCalled();
    });

    it('should not call onAddTodo with whitespace-only text on Enter', async () => {
      const user = userEvent.setup();
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '   ');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnAddTodo).not.toHaveBeenCalled();
      expect(input).toHaveValue('   '); // Input should not be cleared
    });

    it('should not trigger on other keys', async () => {
      const user = userEvent.setup();
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Task');
      fireEvent.keyDown(input, { key: 'Tab' });

      expect(mockOnAddTodo).not.toHaveBeenCalled();
    });
  });

  describe('button click submission', () => {
    it('should call onAddTodo with trimmed text on button click', async () => {
      const user = userEvent.setup();
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add todo/i });

      await user.type(input, '  Clean room  ');
      await user.click(button);

      expect(mockOnAddTodo).toHaveBeenCalledWith('Clean room');
      expect(input).toHaveValue('');
    });

    it('should clear input after button click submission', async () => {
      const user = userEvent.setup();
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add todo/i });

      await user.type(input, 'Task');
      await user.click(button);

      expect(input).toHaveValue('');
    });

    it('should not call onAddTodo with empty text on button click', async () => {
      const user = userEvent.setup();
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const button = screen.getByRole('button', { name: /add todo/i });
      await user.click(button);

      expect(mockOnAddTodo).not.toHaveBeenCalled();
    });

    it('should not call onAddTodo with whitespace-only text on button click', async () => {
      const user = userEvent.setup();
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add todo/i });

      await user.type(input, '   ');
      await user.click(button);

      expect(mockOnAddTodo).not.toHaveBeenCalled();
      expect(input).toHaveValue('   '); // Input should not be cleared
    });
  });

  describe('input behavior', () => {
    it('should update input value on change', async () => {
      const user = userEvent.setup();
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Test input');

      expect(input).toHaveValue('Test input');
    });

    it('should handle multiple submissions', async () => {
      const user = userEvent.setup();
      render(<TodoInput onAddTodo={mockOnAddTodo} />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');

      await user.type(input, 'First task');
      await user.click(button);

      await user.type(input, 'Second task');
      await user.click(button);

      expect(mockOnAddTodo).toHaveBeenCalledTimes(2);
      expect(mockOnAddTodo).toHaveBeenNthCalledWith(1, 'First task');
      expect(mockOnAddTodo).toHaveBeenNthCalledWith(2, 'Second task');
    });
  });
});
