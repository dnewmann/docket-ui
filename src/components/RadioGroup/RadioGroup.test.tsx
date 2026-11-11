import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('selects an option, links descriptions, and announces errors', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <RadioGroup
        label="Contribution frequency"
        options={[{ value: 'monthly', label: 'Monthly', description: 'On the 1st' }, { value: 'yearly', label: 'Yearly' }]}
        onValueChange={onValueChange}
        error="Choose a frequency"
      />,
    );
    const monthly = screen.getByRole('radio', { name: 'Monthly' });
    expect(monthly).toHaveAccessibleDescription('On the 1st');
    expect(screen.getByRole('group', { name: 'Contribution frequency' })).toHaveAccessibleDescription('Choose a frequency');
    await user.click(monthly);
    expect(monthly).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('monthly');
    expect(await axe(container)).toHaveNoViolations();
  });
});
