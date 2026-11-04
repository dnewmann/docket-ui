import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssistantChat } from './AssistantChat';

const meta = {
  title: 'Patterns/AI assistant',
  component: AssistantChat,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A small AI assistant built only from Docket UI: saved chats with pinning, a saved prompt library you can add to, and a chat window with thinking and streaming states. Replies are fixed and nothing leaves the page. Click the message box to start. Original design; all data is fictional.',
      },
    },
  },
  decorators: [(Story) => <div style={{ margin: -24 }}>{Story()}</div>],
} satisfies Meta<typeof AssistantChat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Phone: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
};
