import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('shows on focus, describes the trigger, and hides on Escape and blur', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Total return includes dividends">
        <button type="button">Total return</button>
      </Tooltip>,
    );
    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Total return' });
    const tip = await screen.findByRole('tooltip');
    expect(trigger).toHaveAccessibleDescription('Total return includes dividends');
    expect(trigger.getAttribute('aria-describedby')).toBe(tip.id);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.tab();
    expect(trigger).not.toHaveAttribute('aria-describedby');
  });

  it('shows on hover after the delay', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help" delay={0}>
        <button type="button">Info</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button', { name: 'Info' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Help');
    await user.unhover(screen.getByRole('button', { name: 'Info' }));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('has no axe violations while open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tooltip content="Help">
        <button type="button">Info</button>
      </Tooltip>,
    );
    await user.tab();
    await screen.findByRole('tooltip');
    expect(await axe(container)).toHaveNoViolations();
  });
});
