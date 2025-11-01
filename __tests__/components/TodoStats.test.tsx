import { render, screen } from '@testing-library/react';
import { TodoStats } from '@/components/TodoStats';
import type { Todo } from '@/types/todo';

describe('TodoStats', () => {
  const createMockTodo = (id: string, completed: boolean): Todo => ({
    id,
    text: `Todo ${id}`,
    completed,
    createdAt: Date.now(),
  });

  it('should display zero stats for empty todos array', () => {
    render(<TodoStats todos={[]} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3); // Total, Completed, and Pending all show 0
  });

  it('should display correct total count', () => {
    const todos = [
      createMockTodo('1', false),
      createMockTodo('2', true),
      createMockTodo('3', false),
    ];

    render(<TodoStats todos={todos} />);

    // Find the total stat (first occurrence of number)
    const totalElement = screen.getByText('3');
    expect(totalElement).toBeInTheDocument();
  });

  it('should display correct completed count', () => {
    const todos = [
      createMockTodo('1', false),
      createMockTodo('2', true),
      createMockTodo('3', true),
    ];

    render(<TodoStats todos={todos} />);

    // Find completed count
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/Completed/)).toBeInTheDocument();
  });

  it('should display correct pending count', () => {
    const todos = [
      createMockTodo('1', false),
      createMockTodo('2', true),
      createMockTodo('3', false),
    ];

    render(<TodoStats todos={todos} />);

    // Find pending count
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should display all three stat labels', () => {
    const todos = [createMockTodo('1', false)];

    render(<TodoStats todos={todos} />);

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should handle all completed todos', () => {
    const todos = [
      createMockTodo('1', true),
      createMockTodo('2', true),
    ];

    render(<TodoStats todos={todos} />);

    // Total: 2, Completed: 2, Pending: 0
    const numbers = screen.getAllByText('2');
    expect(numbers).toHaveLength(2); // Total and Completed both show 2
    expect(screen.getByText('0')).toBeInTheDocument(); // Pending is 0
  });

  it('should handle all pending todos', () => {
    const todos = [
      createMockTodo('1', false),
      createMockTodo('2', false),
    ];

    render(<TodoStats todos={todos} />);

    // Total: 2, Completed: 0, Pending: 2
    const numbers = screen.getAllByText('2');
    expect(numbers).toHaveLength(2); // Total and Pending both show 2
    expect(screen.getByText('0')).toBeInTheDocument(); // Completed is 0
  });

  it('should have proper styling', () => {
    const { container } = render(<TodoStats todos={[]} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
