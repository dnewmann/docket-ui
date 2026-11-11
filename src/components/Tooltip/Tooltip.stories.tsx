import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Short supporting text on hover and keyboard focus, linked with aria-describedby. Escape dismisses it. Never put essential information only in a tooltip, and wrap a focusable element so keyboard users can reach it.',
      },
    },
  },
  args: {
    content: 'Privileged matters are excluded from external exports',
    children: <Button variant="secondary">Privileged</Button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Bottom: Story = { args: { placement: 'bottom' } };
