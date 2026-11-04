import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type TableColumn } from './Table';
import { matters, type Matter } from '../../patterns/matters-data';

const columns: TableColumn<Matter>[] = [
  { key: 'number', header: 'No.', sortValue: (m) => m.number, width: '96px' },
  { key: 'name', header: 'Matter', sortValue: (m) => m.name },
  { key: 'client', header: 'Client', sortValue: (m) => m.client },
  { key: 'status', header: 'Status', sortValue: (m) => m.status },
  { key: 'hours', header: 'Hours', align: 'end', sortValue: (m) => m.hours },
];

const meta = {
  title: 'Components/Table',
  component: Table<Matter>,
  tags: ['autodocs'],
  args: {
    caption: 'Open matters',
    columns,
    rows: matters,
    rowKey: (m: Matter) => m.id,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Semantic table with sortable columns (real buttons in the headers, state in aria-sort). Uses a container query, so it restacks into labelled cards whenever its container is under 600px wide, whether that is a phone or a narrow panel.',
      },
    },
  },
} satisfies Meta<typeof Table<Matter>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sorted: Story = {
  args: { defaultSort: { key: 'hours', direction: 'descending' } },
};

export const NarrowContainer: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
};

export const Empty: Story = {
  args: { rows: [], empty: 'No matters match these filters.' },
};
