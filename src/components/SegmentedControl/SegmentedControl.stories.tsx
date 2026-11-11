import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from './SegmentedControl';

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A compact single choice built on native radio inputs, so arrow keys and screen readers work out of the box. Good for time ranges and view modes.' } } },
  args: {
    label: 'Time range',
    defaultValue: '1Y',
    options: ['1M', '6M', 'YTD', '1Y', '5Y', 'Max'].map((v) => ({ value: v, label: v })),
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const HiddenLabel: Story = { args: { hideLabel: true } };
