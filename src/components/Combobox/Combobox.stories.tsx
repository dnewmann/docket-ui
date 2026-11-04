import type { Meta, StoryObj } from '@storybook/react-vite';
import { Combobox } from './Combobox';
import { clientOptions, searchMatters } from '../../patterns/matters-data';

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: { label: 'Client', options: clientOptions, placeholder: 'Search clients' },
  decorators: [(Story) => <div style={{ maxWidth: 380, minHeight: 360 }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          'Text input with a filtered listbox, following the WAI-ARIA combobox pattern. Focus stays in the input; arrow keys move aria-activedescendant through options; Enter selects; Escape closes. Supports static options or async `loadOptions` with debounce and request cancellation. Result counts are announced in a live region.',
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {};

export const AsyncSearch: Story = {
  args: {
    label: 'Find a matter',
    options: undefined,
    loadOptions: searchMatters,
    minChars: 2,
    placeholder: 'Try "acme" or "26-04"',
    hint: 'Searches a simulated server with 350 ms latency',
    emptyMessage: 'No matters found',
  },
};

export const WithError: Story = {
  args: { error: 'Choose a client', required: true },
};
