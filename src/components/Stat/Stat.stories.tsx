import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from './Stat';

const meta = {
  title: 'Components/Stat',
  component: Stat,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single metric with an optional change. Direction uses an arrow, a sign and words for screen readers, not color alone. Use invertDelta when a decrease is good.',
      },
    },
  },
  args: { label: 'Billed this quarter', value: '$1,284,500', delta: 0.064, deltaLabel: 'vs last quarter' },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Row: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
      <Stat label="Open matters" value="148" delta={0.03} deltaLabel="this month" />
      <Stat label="Write-offs" value="$42,100" delta={-0.12} invertDelta deltaLabel="vs last quarter" />
      <Stat label="Overdue invoices" value="9" delta={0.25} invertDelta deltaLabel="this month" />
      <Stat label="Avg. days to close" value="31" delta={0} hint="Rolling 90 days" />
    </div>
  ),
};
