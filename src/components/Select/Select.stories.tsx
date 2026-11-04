import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const practiceAreas = [
  { value: 'litigation', label: 'Litigation' },
  { value: 'ma', label: 'Mergers & Acquisitions' },
  { value: 'ip', label: 'Intellectual Property' },
  { value: 'employment', label: 'Employment' },
  { value: 'tax', label: 'Tax', disabled: true },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Practice area', options: practiceAreas, placeholder: 'Choose an area' },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          'A styled native select. Native keeps keyboard support, screen reader support and the mobile picker for free. For long or searchable lists, use Combobox (planned).',
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithHint: Story = {
  args: { hint: 'Used to route the matter to the right team' },
};

export const WithError: Story = {
  args: { error: 'Pick a practice area', required: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'litigation', placeholder: undefined },
};
