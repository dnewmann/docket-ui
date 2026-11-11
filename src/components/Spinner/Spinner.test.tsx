import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('announces its label as a status', async () => {
    const { container } = render(<Spinner label="Loading prices" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading prices');
    expect(await axe(container)).toHaveNoViolations();
  });
});
