import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Stat } from './Stat';

describe('Stat', () => {
  it('shows a signed percent change with direction words for screen readers', () => {
    render(<Stat label="Total value" value="$12,480.20" delta={0.0523} deltaLabel="since purchase" />);
    expect(screen.getByText('$12,480.20')).toBeInTheDocument();
    const delta = screen.getByText(/5\.23%/).closest('p')!;
    expect(delta).toHaveTextContent('Up +5.23% since purchase');
  });

  it('marks a decrease as good when invertDelta is set', () => {
    const { container } = render(<Stat label="Fees" value="$12" delta={-0.1} invertDelta />);
    const delta = screen.getByText(/10%/).closest('p')!;
    expect(delta).toHaveTextContent('Down -10%');
    expect(delta.className).toContain('up');
    expect(container).toBeTruthy();
  });

  it('shows no change for zero', () => {
    render(<Stat label="Cash" value="$0" delta={0} />);
    expect(screen.getByText(/0%/).closest('p')).toHaveTextContent('No change 0%');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Stat label="Total value" value="$1" delta={-0.02} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
