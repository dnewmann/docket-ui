import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Pagination, pageItems } from './Pagination';

describe('pageItems', () => {
  it('collapses distant pages and fills single-page gaps', () => {
    expect(pageItems(1, 3)).toEqual([1, 2, 3]);
    expect(pageItems(5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10]);
    expect(pageItems(3, 10)).toEqual([1, 2, 3, 4, 'gap', 10]);
  });
});

describe('Pagination', () => {
  it('marks the current page, disables Previous on page 1, and changes page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { container } = render(<Pagination page={1} pageCount={8} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /Next/ }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders nothing for a single page', () => {
    const { container } = render(<Pagination page={1} pageCount={1} onPageChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
