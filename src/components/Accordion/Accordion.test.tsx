import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Accordion } from './Accordion';

const items = [
  { id: 'a', title: 'What is a conflict check?', content: 'A search for existing clients and parties.' },
  { id: 'b', title: 'Who can see privileged matters?', content: 'No.' },
];

describe('Accordion', () => {
  it('toggles sections; only one open unless multiple', async () => {
    const user = userEvent.setup();
    const { container } = render(<Accordion items={items} />);
    const a = screen.getByRole('button', { name: 'What is a conflict check?' });
    const b = screen.getByRole('button', { name: 'Who can see privileged matters?' });
    expect(a).toHaveAttribute('aria-expanded', 'false');
    await user.click(a);
    expect(screen.getByRole('region', { name: 'What is a conflict check?' })).toHaveTextContent('A search for existing');
    await user.click(b);
    expect(a).toHaveAttribute('aria-expanded', 'false');
    expect(b).toHaveAttribute('aria-expanded', 'true');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps several open with multiple', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} multiple />);
    await user.click(screen.getByRole('button', { name: 'What is a conflict check?' }));
    await user.click(screen.getByRole('button', { name: 'Who can see privileged matters?' }));
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });
});
