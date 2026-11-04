import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Notify me when new filings arrive' },
  parameters: {
    docs: {
      description: {
        component:
          'A native checkbox with a custom visual. The real input stays focusable, so Space, forms and screen readers work without extra code. Supports a mixed (indeterminate) state for select-all patterns.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDescription: Story = {
  args: { label: 'Privileged', description: 'Excluded from exports shared with opposing counsel' },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled and checked" disabled defaultChecked />
    </div>
  ),
};

const matters = ['Acme v. Globex', 'In re Initech', 'Hooli patent review'];

export const SelectAll: Story = {
  render: function SelectAllStory() {
    const [selected, setSelected] = useState<string[]>([matters[0]]);
    const all = selected.length === matters.length;
    const some = selected.length > 0 && !all;
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Checkbox
          label="Select all matters"
          checked={all}
          indeterminate={some}
          onChange={() => setSelected(all ? [] : matters)}
        />
        <div style={{ display: 'grid', gap: 10, paddingLeft: 26 }}>
          {matters.map((m) => (
            <Checkbox
              key={m}
              label={m}
              checked={selected.includes(m)}
              onChange={(e) =>
                setSelected((prev) => (e.target.checked ? [...prev, m] : prev.filter((x) => x !== m)))
              }
            />
          ))}
        </div>
      </div>
    );
  },
};
