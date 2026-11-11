import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('shows a heading, description and action', async () => {
    const { container } = render(<EmptyState title="No holdings yet" description="Add your first position." action={<button type="button">Add holding</button>} />);
    expect(screen.getByRole('heading', { name: 'No holdings yet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add holding' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
