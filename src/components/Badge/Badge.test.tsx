import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its text with a tone class', async () => {
    const { container } = render(<Badge tone="success">Gain</Badge>);
    expect(screen.getByText('Gain').className).toContain('success');
    expect(await axe(container)).toHaveNoViolations();
  });
});
