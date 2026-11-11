import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Multi-line text with the same label, hint and error wiring as TextField, and an optional live character count.' } } },
  args: { label: 'Matter summary', hint: 'Visible to everyone on the matter', maxLength: 280, showCount: true },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const WithError: Story = { args: { error: 'Add a short summary', required: true } };
