import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/EmptyState';

describe('EmptyState', () => {
  it('should render empty state message', () => {
    render(<EmptyState />);

    expect(screen.getByText(/No tasks yet/)).toBeInTheDocument();
    expect(screen.getByText(/Add one to get started and stay productive/)).toBeInTheDocument();
  });

  it('should render encouraging text with emoji', () => {
    render(<EmptyState />);

    expect(screen.getByText('✨', { exact: false })).toBeInTheDocument();
  });

  it('should have proper styling and layout', () => {
    const { container } = render(<EmptyState />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'py-16', 'text-center');
  });

  it('should have proper text styling', () => {
    render(<EmptyState />);

    const text = screen.getByText(/No tasks yet/);
    expect(text).toHaveClass('text-xl', 'font-semibold', 'text-gray-800');
  });
});
