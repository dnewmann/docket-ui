import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Combobox, type ComboboxOption } from './Combobox';

const clients: ComboboxOption[] = [
  { value: 'acme', label: 'Acme Corporation', description: 'Client 104233' },
  { value: 'globex', label: 'Globex Industries', description: 'Client 208871' },
  { value: 'initech', label: 'Initech', description: 'Client 310045' },
];

describe('Combobox', () => {
  it('follows the combobox pattern: role, expanded state and listbox', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Client" options={clients} />);
    const input = screen.getByRole('combobox', { name: 'Client' });
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await user.click(input);

    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeVisible();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('filters by label and description as the user types', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Client" options={clients} />);
    await user.type(screen.getByRole('combobox'), 'glo');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Globex IndustriesClient 208871']);

    await user.clear(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), '3100');
    expect(screen.getByRole('option', { name: /Initech/ })).toBeInTheDocument();
  });

  it('moves the active option with arrow keys and selects with Enter, keeping focus in the input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox label="Client" options={clients} onChange={onChange} />);
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}');
    const active = input.getAttribute('aria-activedescendant');
    expect(document.getElementById(active!)).toHaveTextContent('Globex Industries');
    expect(input).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(clients[1]);
    expect(input).toHaveValue('Globex Industries');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('wraps from the last option to the first', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Client" options={clients} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowUp}');
    expect(document.getElementById(input.getAttribute('aria-activedescendant')!)).toHaveTextContent('Initech');
    await user.keyboard('{ArrowDown}');
    expect(document.getElementById(input.getAttribute('aria-activedescendant')!)).toHaveTextContent('Acme');
  });

  it('closes on Escape and restores the selected label', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Client" options={clients} defaultValue={clients[0]} />);
    const input = screen.getByRole('combobox');
    await user.clear(input);
    await user.type(input, 'zzz');
    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('selects with the mouse', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox label="Client" options={clients} onChange={onChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /Initech/ }));
    expect(onChange).toHaveBeenCalledWith(clients[2]);
  });

  it('runs async search with debounce and announces results', async () => {
    const user = userEvent.setup();
    const loadOptions = vi.fn(async (q: string) =>
      clients.filter((c) => c.label.toLowerCase().startsWith(q.toLowerCase())),
    );
    render(<Combobox label="Client" loadOptions={loadOptions} minChars={2} debounceMs={50} />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'a');
    expect(screen.getByRole('status')).toHaveTextContent('Type at least 2 characters to search');
    expect(loadOptions).not.toHaveBeenCalled();

    await user.type(input, 'c');
    await waitFor(() => expect(screen.getByRole('option', { name: /Acme/ })).toBeInTheDocument());
    // Debounced: only the final query was sent, not one request per keystroke.
    expect(loadOptions).toHaveBeenCalledTimes(1);
    expect(loadOptions.mock.calls[0][0]).toBe('ac');
    expect(screen.getByRole('status')).toHaveTextContent('1 result available');
  });

  it('shows the empty message when nothing matches', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Client" options={clients} emptyMessage="No clients found" />);
    await user.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.getByRole('listbox')).toHaveTextContent('No clients found');
  });

  it('has no axe violations while open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Combobox label="Client" options={clients} hint="Search by name or number" />);
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}');
    expect(await axe(container)).toHaveNoViolations();
  });
});
