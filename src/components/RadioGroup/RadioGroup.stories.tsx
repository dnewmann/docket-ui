import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'One choice from a short list, with optional descriptions. Native radios in a fieldset; errors are linked to the group.' } } },
  args: {
    label: 'Billing arrangement',
    defaultValue: 'hourly',
    options: [
      { value: 'hourly', label: 'Hourly', description: 'Billed monthly against time entries' },
      { value: 'flat', label: 'Flat fee', description: 'One agreed amount for the matter' },
      { value: 'contingency', label: 'Contingency', description: 'A share of the recovery', disabled: true },
    ],
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const WithError: Story = { args: { defaultValue: undefined, required: true, error: 'Choose a billing arrangement' } };
