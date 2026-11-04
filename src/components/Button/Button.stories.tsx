import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14" />
  </svg>
);

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Save matter', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Triggers an action. Use one primary button per view. Loading keeps the button focusable and its width stable, and announces a status to screen readers.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button {...args} variant="primary">Save matter</Button>
      <Button {...args} variant="secondary">Cancel</Button>
      <Button {...args} variant="ghost">View history</Button>
      <Button {...args} variant="danger">Archive matter</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { children: 'Export filings', variant: 'secondary', startIcon: <DownloadIcon /> },
};

export const Loading: Story = {
  args: { loading: true, loadingLabel: 'Saving matter' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
