import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton width={120} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the requested number of lines with a shorter last line', () => {
    const { container } = render(<Skeleton lines={3} />);
    const lines = container.querySelectorAll('span > span');
    expect(lines).toHaveLength(3);
    expect((lines[2] as HTMLElement).style.width).toBe('60%');
  });
});
