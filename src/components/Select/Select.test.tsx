import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Select } from './Select';

const practiceAreas = [
  { value: 'litigation', label: 'Litigation' },
  { value: 'ma', label: 'Mergers & Acquisitions' },
  { value: 'ip', label: 'Intellectual Property' },
];

describe('Select', () => {
  it('labels the select and lets the user choose an option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Practice area" options={practiceAreas} onChange={onChange} />);
    const select = screen.getByRole('combobox', { name: 'Practice area' });

    await user.selectOptions(select, 'ip');

    expect(select).toHaveValue('ip');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('starts on a disabled placeholder when one is given', () => {
    render(<Select label="Practice area" options={practiceAreas} placeholder="Choose an area" />);
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Choose an area' })).toBeDisabled();
  });

  it('announces errors', () => {
    render(<Select label="Practice area" options={practiceAreas} error="Pick a practice area" />);
    const select = screen.getByRole('combobox', { name: 'Practice area' });
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAccessibleDescription('Pick a practice area');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Select label="Practice area" options={practiceAreas} placeholder="Choose an area" hint="Used for routing" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
