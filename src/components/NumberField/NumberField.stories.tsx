import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberField, type NumberFieldProps } from './NumberField';

function Controlled(props: Omit<NumberFieldProps, 'value' | 'onValueChange'> & { initial?: number | null }) {
  const { initial = null, ...rest } = props;
  const [value, setValue] = useState<number | null>(initial);
  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <NumberField {...rest} value={value} onValueChange={setValue} />
      <code style={{ fontSize: 12, color: 'var(--dk-color-text-secondary)' }}>value: {JSON.stringify(value)}</code>
    </div>
  );
}

const meta = {
  title: 'Components/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A text input for money, percentages and plain numbers. Grouped and formatted at rest, plain digits while editing, and it reports a parsed number (or null) so callers never handle strings. Percent values are fractions: 0.07 means 7%. Uses tabular numbers so digits line up.',
      },
    },
  },
  args: { label: 'Amount', value: null, onValueChange: () => {} },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Currency: Story = { render: () => <Controlled label="Retainer amount" format="currency" initial={25000} hint="USD" /> };
export const Percent: Story = { render: () => <Controlled label="Discount rate" format="percent" initial={0.075} /> };
export const Decimal: Story = { render: () => <Controlled label="Billable hours" initial={12.5} /> };
export const WithError: Story = {
  render: () => <Controlled label="Retainer amount" format="currency" error="Enter an amount above $0" required />,
};
