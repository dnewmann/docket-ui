import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Accordion } from './Accordion';

const items = [
  { id: 'a', title: 'What is a hindcast?', content: 'Testing a model on past data.' },
  { id: 'b', title: 'Is this advice?', content: 'No.' },
];

describe('Accordion', () => {
  it('toggles sections; only one open unless multiple', async () => {
    const user = userEvent.setup();
    const { container } = render(<Accordion items={items} />);
    const a = screen.getByRole('button', { name: 'What is a hindcast?' });
    const b = screen.getByRole('button', { name: 'Is this advice?' });
    expect(a).toHaveAttribute('aria-expanded', 'false');
    await user.click(a);
    expect(screen.getByRole('region', { name: 'What is a hindcast?' })).toHaveTextContent('Testing a model');
    await user.click(b);
    expect(a).toHaveAttribute('aria-expanded', 'false');
    expect(b).toHaveAttribute('aria-expanded', 'true');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps several open with multiple', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} multiple />);
    await user.click(screen.getByRole('button', { name: 'What is a hindcast?' }));
    await user.click(screen.getByRole('button', { name: 'Is this advice?' }));
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });
});
