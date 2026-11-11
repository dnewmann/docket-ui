import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'A short status label. The text carries the meaning; color only reinforces it.' } },
  },
  args: { children: 'Active', tone: 'success' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge>Draft</Badge>
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">On hold</Badge>
      <Badge tone="danger">Overdue</Badge>
      <Badge tone="info">New</Badge>
    </div>
  ),
};
