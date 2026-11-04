import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Matter name', placeholder: 'e.g. Acme v. Globex' },
  argTypes: { startIcon: { control: false } },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          'Single-line text input with a built-in label, hint and error. Hints and errors are wired to the input with aria-describedby, and an error replaces the hint so screen readers hear one message.',
      },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithHint: Story = {
  args: { label: 'Client ID', hint: 'Six digits, from the intake form', placeholder: '000000' },
};

export const WithError: Story = {
  args: { label: 'Client ID', defaultValue: '12A', error: 'Client ID must be six digits' },
};

export const Required: Story = {
  args: { required: true },
};

export const Search: Story = {
  args: { label: 'Search matters', hideLabel: true, placeholder: 'Search matters', startIcon: <SearchIcon />, type: 'search' },
};

export const Disabled: Story = {
  args: { label: 'Docket number', defaultValue: '2:26-cv-01234', disabled: true },
};
