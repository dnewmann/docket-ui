import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeskBooking } from './DeskBooking';

const meta = {
  title: 'Patterns/Desk booking',
  component: DeskBooking,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A small desk-booking feature built only from Docket UI: an SVG floor plan with four keyboard-accessible desks, booking for a chosen day, a "My bookings" list, and cancellation through a confirm Modal. Desk state is shown by shape and text as well as color. Original design; all data is fictional.',
      },
    },
  },
  decorators: [(Story) => <div style={{ margin: -24 }}>{Story()}</div>],
} satisfies Meta<typeof DeskBooking>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Phone: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
};
