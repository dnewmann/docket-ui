import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('is labelled, shows a live character count, and has no axe violations', async () => {
    const user = userEvent.setup();
    const { container } = render(<Textarea label="Question" maxLength={50} showCount hint="Ask in plain English" />);
    const box = screen.getByRole('textbox', { name: 'Question' });
    expect(box).toHaveAccessibleDescription('Ask in plain English');
    await user.type(box, 'What if');
    expect(screen.getByText('7 / 50')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
