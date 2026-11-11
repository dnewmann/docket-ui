import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Switches between views in the same context. Follows the WAI-ARIA tabs pattern: arrow keys move between tabs, Home and End jump, and only the selected tab is in the Tab order. The selected tab is marked with a bar, not only color.',
      },
    },
  },
  args: {
    label: 'Matter views',
    items: [
      { id: 'overview', label: 'Overview', content: <p>Status, owner and key dates for the matter.</p> },
      { id: 'documents', label: 'Documents', content: <p>12 documents, last updated today.</p> },
      { id: 'billing', label: 'Billing', content: <p>Budget and billed hours to date.</p> },
      { id: 'archive', label: 'Archive', content: <p>Archived items.</p>, disabled: true },
    ],
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Pill: Story = { args: { variant: 'pill' } };
export const StartOnSecondTab: Story = { args: { defaultValue: 'documents' } };
