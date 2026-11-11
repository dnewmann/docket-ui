import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from './Menu';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A menu button following the WAI-ARIA pattern: arrow keys, Home/End, Escape returns focus, click outside closes. Destructive items are marked danger.' } },
  },
  args: {
    label: 'Actions',
    items: [
      { id: 'rename', label: 'Rename', onSelect: () => {} },
      { id: 'duplicate', label: 'Duplicate', onSelect: () => {} },
      { id: 'export', label: 'Export (coming soon)', onSelect: () => {}, disabled: true },
      { id: 'archive', label: 'Archive matter', onSelect: () => {}, danger: true },
    ],
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
