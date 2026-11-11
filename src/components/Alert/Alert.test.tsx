import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Alert } from './Alert';

describe('Alert', () => {
  it('uses role=alert for warnings and errors, status otherwise', () => {
    const { rerender } = render(<Alert tone="danger" title="Couldn't load prices" />);
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't load prices");
    rerender(<Alert tone="success" title="Saved" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('calls onDismiss and has no axe violations', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { container } = render(<Alert title="Heads up" onDismiss={onDismiss}>Body</Alert>);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });
});
