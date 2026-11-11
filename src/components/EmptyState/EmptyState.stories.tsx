import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Shown when there is no data yet: what this area is for and the one next step.' } } },
  args: {
    title: 'No matters yet',
    description: 'Matters you open or are assigned to will appear here.',
    action: <Button>Create matter</Button>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
