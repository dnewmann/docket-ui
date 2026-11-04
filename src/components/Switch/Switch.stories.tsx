import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Email digests' },
  parameters: {
    docs: {
      description: {
        component:
          'An on/off setting that takes effect immediately, announced as a switch with aria-checked. Use Checkbox when the choice is saved later with a form.',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDescription: Story = {
  args: { label: 'Auto-assign new matters', description: 'Routes new matters to the partner on call', defaultChecked: true },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Disabled" disabled />
      <Switch label="Disabled and on" disabled defaultChecked />
    </div>
  ),
};
