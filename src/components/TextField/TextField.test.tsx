import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { TextField } from './TextField';

describe('TextField', () => {
  it('labels the input and accepts typing', async () => {
    const user = userEvent.setup();
    render(<TextField label="Matter name" />);
    const input = screen.getByRole('textbox', { name: 'Matter name' });
    await user.type(input, 'Acme v. Globex');
    expect(input).toHaveValue('Acme v. Globex');
  });

  it('connects hint text through aria-describedby', () => {
    render(<TextField label="Client ID" hint="Six digits, from the intake form" />);
    expect(screen.getByRole('textbox', { name: 'Client ID' })).toHaveAccessibleDescription(
      'Six digits, from the intake form',
    );
  });

  it('marks the input invalid and announces the error instead of the hint', () => {
    render(<TextField label="Client ID" hint="Six digits" error="Client ID must be six digits" />);
    const input = screen.getByRole('textbox', { name: 'Client ID' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Client ID must be six digits');
    expect(screen.queryByText('Six digits')).not.toBeInTheDocument();
  });

  it('keeps a hidden label available to screen readers', () => {
    render(<TextField label="Search matters" hideLabel />);
    expect(screen.getByRole('textbox', { name: 'Search matters' })).toBeInTheDocument();
  });

  it('marks required fields', () => {
    render(<TextField label="Matter name" required />);
    expect(screen.getByRole('textbox', { name: /Matter name/ })).toBeRequired();
  });

  it('has no axe violations in default, error and disabled states', async () => {
    const { container } = render(
      <div>
        <TextField label="Matter name" hint="As it appears on filings" />
        <TextField label="Client ID" error="Required" />
        <TextField label="Docket number" disabled defaultValue="2:26-cv-01234" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
