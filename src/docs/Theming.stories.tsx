import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Card, Progress, SegmentedControl, Stat, Tabs } from '../index';

/** One small screen, rendered under different themes. Only tokens change between them. */
function Dashboard() {
  return (
    <div style={{ display: 'grid', gap: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--dk-color-text-primary)' }}>
          My <strong style={{ fontWeight: 700 }}>Matters</strong>
        </h2>
        <Button>+ New matter</Button>
      </div>

      <Tabs
        variant="pill"
        label="Views"
        items={[
          { id: 'open', label: 'Open', content: null },
          { id: 'due', label: 'Due this week', content: null },
          { id: 'closed', label: 'Closed', content: null },
        ]}
      />

      <Card variant="feature">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <Stat label="Billed this quarter" value="$1,284,500" delta={0.064} deltaLabel="vs last quarter" />
          <Badge tone="success">On target</Badge>
        </div>
        <div style={{ marginTop: 32 }}>
          <SegmentedControl
            label="Period"
            hideLabel
            defaultValue="Quarter"
            options={['Month', 'Quarter', 'Year'].map((v) => ({ value: v, label: v }))}
          />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        <Card>
          <Stat label="Write-offs" value="$42,100" delta={-0.12} invertDelta deltaLabel="vs last quarter" />
        </Card>
        <Card>
          <Progress label="Matter budget" value={64000} max={100000} valueLabel="$64,000 of $100,000" />
          <div style={{ marginTop: 24 }}>
            <Button variant="secondary" size="sm">
              Adjust budget
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Panel({ title, theme }: { title: string; theme: 'light' | 'dark' }) {
  return (
    <section
      data-theme={theme}
      style={{ padding: 32, borderRadius: 32, background: 'var(--dk-color-bg-canvas)', minWidth: 0 }}
    >
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--dk-color-text-secondary)',
        }}
      >
        {title}
      </p>
      <Dashboard />
    </section>
  );
}

const meta = {
  title: 'Foundations/Theming',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The same screen in light and dark. Only semantic tokens differ between the two; components and patterns never hard-code a color. To re-brand, override semantic tokens (and, for shape and space, component tokens) in one CSS file: see the README.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideBySide: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24, padding: 24, background: 'var(--dk-color-bg-canvas)' }}>
      <Panel title="Light" theme="light" />
      <Panel title="Dark" theme="dark" />
    </div>
  ),
};
