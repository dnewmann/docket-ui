import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Progress toward a goal, exposed as role="progressbar" with value and text. Values outside the range are clamped.' } } },
  args: { label: 'Budget used', value: 64000, max: 100000, valueLabel: '$64,000 of $100,000' },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Percent: Story = { args: { label: 'Documents reviewed', value: 38, max: 100, valueLabel: undefined } };
