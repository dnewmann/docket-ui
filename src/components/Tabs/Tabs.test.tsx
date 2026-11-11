import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Tabs } from './Tabs';

const items = [
  { id: 'holdings', label: 'Holdings', content: <p>Holdings table</p> },
  { id: 'what-if', label: 'What if', content: <p>What if form</p> },
  { id: 'off', label: 'Taxes', content: <p>Taxes</p>, disabled: true },
  { id: 'proj', label: 'Projections', content: <p>Projection chart</p> },
];

describe('Tabs', () => {
  it('shows the first tab and switches on click', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Portfolio views" items={items} />);
    expect(screen.getByRole('tab', { name: 'Holdings' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Holdings' })).toHaveTextContent('Holdings table');
    await user.click(screen.getByRole('tab', { name: 'What if' }));
    expect(screen.getByRole('tabpanel', { name: 'What if' })).toHaveTextContent('What if form');
  });

  it('moves with arrow keys, skips disabled tabs, and wraps; Home and End jump', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs label="Portfolio views" items={items} onValueChange={onValueChange} />);
    screen.getByRole('tab', { name: 'Holdings' }).focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Projections' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Holdings' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Projections' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Home}');
    expect(onValueChange).toHaveBeenLastCalledWith('holdings');
  });

  it('keeps only the selected tab in the Tab order', () => {
    render(<Tabs label="Portfolio views" items={items} defaultValue="what-if" />);
    expect(screen.getByRole('tab', { name: 'What if' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Holdings' })).toHaveAttribute('tabindex', '-1');
  });

  it('has no axe violations in both variants', async () => {
    const { container } = render(
      <>
        <Tabs label="Portfolio views" items={items} />
        <Tabs label="Filters" items={items} variant="pill" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
