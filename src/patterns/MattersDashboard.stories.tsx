import type { Meta, StoryObj } from '@storybook/react-vite';
import { MattersDashboard } from './MattersDashboard';

const meta = {
  title: 'Patterns/Matters dashboard',
  component: MattersDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full product screen built only from Docket UI: app shell with skip link, async search (Combobox), summary stats, filters (Select, Switch), a sortable Table that restacks on narrow screens, and a Modal create flow. All data is fictional.',
      },
    },
  },
  decorators: [(Story) => <div style={{ margin: -24 }}>{Story()}</div>],
} satisfies Meta<typeof MattersDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Tablet: Story = {
  globals: { viewport: { value: 'tablet', isRotated: false } },
};

export const Phone: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
};
