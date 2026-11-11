import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Expandable sections following the WAI-ARIA accordion pattern: each title is a button inside a heading, with aria-expanded and a labelled region.' } } },
  args: {
    items: [
      { id: 'conflicts', title: 'How do conflict checks work?', content: 'Every new matter is checked against existing clients and parties before it opens.' },
      { id: 'privilege', title: 'What does "privileged" change?', content: 'Privileged matters are excluded from external exports and reports.' },
      { id: 'billing', title: 'Who can change billing?', content: 'Only the billing partner and finance can change the arrangement.' },
    ],
    defaultOpen: ['conflicts'],
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Multiple: Story = { args: { multiple: true } };
