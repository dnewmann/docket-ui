import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Switch } from './Switch';

describe('Switch', () => {
  it('exposes switch semantics and toggles with click, Space and Enter', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Email digests" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole('switch', { name: 'Email digests' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    await user.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await user.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
  });

  it('toggles when the visible label is clicked', async () => {
    const user = userEvent.setup();
    render(<Switch label="Dark mode" />);
    await user.click(screen.getByText('Dark mode'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [on, setOn] = useState(true);
      return (
        <>
          <Switch label="Auto-assign" checked={on} onCheckedChange={setOn} />
          <span>{on ? 'on' : 'off'}</span>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('switch'));
    expect(screen.getByText('off')).toBeInTheDocument();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Switch label="Locked setting" disabled />);
    await user.click(screen.getByText('Locked setting'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Switch label="Off" />
        <Switch label="On" defaultChecked description="Applies to every new matter" />
        <Switch label="Disabled" disabled />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
