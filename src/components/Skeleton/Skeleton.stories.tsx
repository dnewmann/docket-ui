import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A placeholder while data loads. Hidden from screen readers; mark the loading region with aria-busy instead. The pulse stops when the user prefers reduced motion.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { width: 240, height: 16 } };

export const LoadingCard: Story = {
  render: () => (
    <div aria-busy="true" aria-label="Loading matter" style={{ display: 'grid', gap: 12, maxWidth: 360, padding: 20, border: '1px solid var(--dk-color-border-subtle)', borderRadius: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton circle width={40} />
        <Skeleton width="50%" height={14} />
      </div>
      <Skeleton width="40%" height={28} />
      <Skeleton lines={3} height={12} />
    </div>
  ),
};
