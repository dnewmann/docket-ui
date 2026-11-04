import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { MattersDashboard } from './MattersDashboard';

describe('Matters dashboard (integration)', () => {
  it('filters the table by status and "only mine"', async () => {
    const user = userEvent.setup();
    render(<MattersDashboard />);
    expect(screen.getByText('9 of 9 matters')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'On hold');
    expect(screen.getByText('2 of 9 matters')).toBeInTheDocument();

    await user.click(screen.getByRole('switch', { name: 'Only my matters' }));
    expect(screen.getByText('1 of 9 matters')).toBeInTheDocument();
    expect(within(screen.getByRole('table')).getByText('Hooli trademark opposition')).toBeInTheDocument();
  });

  it('creates a matter through the modal, validating first', async () => {
    const user = userEvent.setup();
    render(<MattersDashboard />);
    const trigger = screen.getByRole('button', { name: 'New matter' });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'New matter' });
    await user.click(within(dialog).getByRole('button', { name: 'Create matter' }));
    expect(within(dialog).getByText('Enter a matter name')).toBeInTheDocument();
    expect(within(dialog).getByText('Choose a client')).toBeInTheDocument();

    await user.type(within(dialog).getByRole('textbox', { name: /Matter name/ }), 'Massive Dynamic audit');
    await user.click(within(dialog).getByRole('combobox', { name: /Client/ }));
    await user.click(within(dialog).getByRole('option', { name: /Initech/ }));
    await user.selectOptions(within(dialog).getByRole('combobox', { name: /Practice area/ }), 'Regulatory');
    await user.click(within(dialog).getByRole('button', { name: 'Create matter' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(within(screen.getByRole('table')).getByText('Massive Dynamic audit')).toBeInTheDocument();
    expect(screen.getByText('10 of 10 matters')).toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<MattersDashboard />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
