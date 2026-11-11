import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Card } from './Card';

describe('Card', () => {
  it('becomes a labelled region when titled, with actions and footer', async () => {
    const { container } = render(<Card title="Holdings" description="As of today" actions={<button type="button">Edit</button>} footer="Updated daily">Body</Card>);
    const region = screen.getByRole('region', { name: 'Holdings' });
    expect(within(region).getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(region).toHaveTextContent('Updated daily');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('applies the feature variant', () => {
    render(<Card title="Highlight" variant="feature">Body</Card>);
    expect(screen.getByRole('region', { name: 'Highlight' }).className).toContain('feature');
  });
});
