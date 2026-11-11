import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A surface that groups related content. With a title it becomes a labelled section landmark.' } } },
  args: {
    title: 'Acme v. Globex',
    description: 'Litigation · Opened Mar 3',
    actions: <Button size="sm" variant="secondary">Open</Button>,
    children: <p style={{ margin: 0 }}>Discovery deadline in 12 days. <Badge tone="warning">At risk</Badge></p>,
    footer: <span style={{ fontSize: 13, color: 'var(--dk-color-text-secondary)' }}>Updated 2 hours ago</span>,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const BodyOnly: Story = { args: { title: undefined, description: undefined, actions: undefined, footer: undefined } };
