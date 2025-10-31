import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/EmptyState';

describe('EmptyState', () => {
  it('should render empty state message', () => {
    render(<EmptyState />);

    expect(screen.getByText('No todos yet')).toBeInTheDocument();
  });

  it('should render encouraging text', () => {
    render(<EmptyState />);

    expect(screen.getByText('Add one above to get started!')).toBeInTheDocument();
  });

  it('should render emoji icon', () => {
    render(<EmptyState />);

    expect(screen.getByText('📝')).toBeInTheDocument();
  });

  it('should have proper styling and layout', () => {
    const { container } = render(<EmptyState />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'py-12', 'text-center');
  });

  it('should have proper text styling for title', () => {
    render(<EmptyState />);

    const title = screen.getByText('No todos yet');
    expect(title).toHaveClass('text-xl', 'text-gray-600', 'mb-2');
  });

  it('should have proper text styling for subtitle', () => {
    render(<EmptyState />);

    const subtitle = screen.getByText('Add one above to get started!');
    expect(subtitle).toHaveClass('text-sm', 'text-gray-500');
  });
});
