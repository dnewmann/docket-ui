import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'An inline message. Warnings and errors use role="alert" so they are announced right away; info and success use role="status".' } } },
  args: { tone: 'info', title: 'Court holiday on Monday', children: 'Filing deadlines move to the next business day.' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
      <Alert tone="info" title="Court holiday on Monday">Filing deadlines move to the next business day.</Alert>
      <Alert tone="success" title="Matter created" onDismiss={() => {}} />
      <Alert tone="warning" title="Conflict check pending">You can save a draft, but not open the matter yet.</Alert>
      <Alert tone="danger" title="Couldn't save">Check your connection and try again.</Alert>
    </div>
  ),
};
