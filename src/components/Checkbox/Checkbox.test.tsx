import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles by clicking the label and with the Space key', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Notify me of filings" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Notify me of filings' });

    await user.click(screen.getByText('Notify me of filings'));
    expect(checkbox).toBeChecked();

    await user.keyboard(' ');
    expect(checkbox).not.toBeChecked();
  });

  it('supports the indeterminate state', () => {
    render(<Checkbox label="Select all matters" indeterminate />);
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });

  it('describes the checkbox with its description text', () => {
    render(<Checkbox label="Privileged" description="Hidden from opposing counsel exports" />);
    expect(screen.getByRole('checkbox', { name: 'Privileged' })).toHaveAccessibleDescription(
      'Hidden from opposing counsel exports',
    );
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Archived" disabled />);
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Mixed" indeterminate />
        <Checkbox label="Disabled" disabled />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
