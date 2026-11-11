import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { SegmentedControl } from './SegmentedControl';

const options = [{ value: '1M', label: '1M' }, { value: '1Y', label: '1Y' }, { value: '5Y', label: '5Y' }];

describe('SegmentedControl', () => {
  it('is a labelled radio group that changes with clicks and arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<SegmentedControl label="Time range" options={options} defaultValue="1Y" onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Time range' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '1Y' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: '5Y' }));
    expect(onValueChange).toHaveBeenLastCalledWith('5Y');
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: '1Y' })).toBeChecked();
    expect(await axe(container)).toHaveNoViolations();
  });
});
