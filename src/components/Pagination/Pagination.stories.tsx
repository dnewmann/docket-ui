import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Moves between pages of results. Distant pages collapse to an ellipsis; the current page has aria-current="page".' } } },
  args: { page: 5, pageCount: 12, onPageChange: () => {} },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;
function InteractivePagination({ pageCount }: { pageCount: number }) {
  const [page, setPage] = useState(5);
  return <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />;
}

export const Interactive: Story = { render: (args) => <InteractivePagination pageCount={args.pageCount} /> };
