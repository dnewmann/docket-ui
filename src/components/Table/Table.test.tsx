import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Table, type TableColumn } from './Table';

interface Matter {
  id: string;
  name: string;
  hours: number;
}

const rows: Matter[] = [
  { id: '1', name: 'Globex patent review', hours: 12 },
  { id: '2', name: 'Acme v. Initech', hours: 40 },
  { id: '3', name: 'Hooli acquisition', hours: 3 },
];

const columns: TableColumn<Matter>[] = [
  { key: 'name', header: 'Matter', sortValue: (r) => r.name },
  { key: 'hours', header: 'Hours', sortValue: (r) => r.hours, align: 'end' },
];

const names = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

describe('Table', () => {
  it('renders a captioned table with column headers', () => {
    render(<Table caption="Open matters" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(screen.getByRole('table', { name: 'Open matters' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
  });

  it('sorts ascending then descending and reports it with aria-sort', async () => {
    const user = userEvent.setup();
    render(<Table caption="Open matters" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const header = screen.getByRole('columnheader', { name: 'Hours' });
    expect(header).toHaveAttribute('aria-sort', 'none');

    await user.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(names()).toEqual(['Hooli acquisition', 'Globex patent review', 'Acme v. Initech']);

    await user.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(names()).toEqual(['Acme v. Initech', 'Globex patent review', 'Hooli acquisition']);
  });

  it('does not mutate the rows passed in', async () => {
    const user = userEvent.setup();
    const input = [...rows];
    render(<Table caption="Open matters" columns={columns} rows={input} rowKey={(r) => r.id} />);
    await user.click(screen.getByRole('button', { name: 'Matter' }));
    expect(input.map((r) => r.id)).toEqual(['1', '2', '3']);
  });

  it('labels every cell for the stacked mobile layout', () => {
    render(<Table caption="Open matters" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const cell = screen.getAllByRole('cell')[1];
    expect(cell).toHaveAttribute('data-label', 'Hours');
  });

  it('shows the empty state', () => {
    render(
      <Table caption="Open matters" columns={columns} rows={[]} rowKey={(r) => r.id} empty="No matters match these filters" />,
    );
    expect(screen.getByText('No matters match these filters')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Table caption="Open matters" columns={columns} rows={rows} rowKey={(r) => r.id} defaultSort={{ key: 'name', direction: 'ascending' }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
