import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Progress } from './Progress';

describe('Progress', () => {
  it('exposes value, range and text, and clamps out-of-range values', async () => {
    const { container, rerender } = render(<Progress label="Retirement goal" value={42000} max={100000} valueLabel="$42,000 of $100,000" />);
    const bar = screen.getByRole('progressbar', { name: 'Retirement goal' });
    expect(bar).toHaveAttribute('aria-valuenow', '42000');
    expect(bar).toHaveAttribute('aria-valuetext', '$42,000 of $100,000');
    expect(await axe(container)).toHaveNoViolations();
    rerender(<Progress label="Retirement goal" value={150} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
