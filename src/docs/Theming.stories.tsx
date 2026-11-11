import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Card, Progress, SegmentedControl, Stat, Tabs } from '../index';
import './themes/hindcast.css';

/** One small screen, rendered under different themes. Only tokens change between them. */
function Dashboard() {
  return (
    <div style={{ display: 'grid', gap: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--dk-color-text-primary)' }}>
          My <strong style={{ fontWeight: 700 }}>Portfolio</strong>
        </h2>
        <Button>+ Add holding</Button>
      </div>

      <Tabs
        variant="pill"
        label="Views"
        items={[
          { id: 'overview', label: 'Overview', content: null },
          { id: 'what-if', label: 'What if', content: null },
          { id: 'projections', label: 'Projections', content: null },
        ]}
      />

      <Card variant="feature">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <Stat label="Total value" value="$48,210" delta={0.124} deltaLabel="this year" />
          <Badge tone="success">On track</Badge>
        </div>
        <div style={{ marginTop: 32 }}>
          <SegmentedControl
            label="Time range"
            hideLabel
            defaultValue="1Y"
            options={['1M', '6M', 'YTD', '1Y', '5Y'].map((v) => ({ value: v, label: v }))}
          />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        <Card>
          <Stat label="If you bought VOO in 2015" value="$27,940" delta={1.794} deltaLabel="on $10,000" />
        </Card>
        <Card>
          <Progress label="Goal: $100,000" value={48210} max={100000} valueLabel="48%" />
          <div style={{ marginTop: 24 }}>
            <Button variant="secondary" size="sm">
              Adjust goal
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Panel({ title, theme, className }: { title: string; theme: 'light' | 'dark'; className?: string }) {
  return (
    <section
      data-theme={theme}
      className={className}
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
          'The same screen under four themes. Hindcast overrides only semantic and component tokens (colors, radius, spacing, heights) in one CSS file: no component code changes. Every text and control color pair in both Hindcast themes passes WCAG AA.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideBySide: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, padding: 24, background: '#0F0F11' }}>
      <Panel title="Docket light" theme="light" />
      <Panel title="Docket dark" theme="dark" />
      <Panel title="Hindcast light" theme="light" className="hc-light" />
      <Panel title="Hindcast dark" theme="dark" className="hc-dark" />
    </div>
  ),
};

export const HindcastLight: Story = { render: () => <Panel title="Hindcast light" theme="light" className="hc-light" /> };
export const HindcastDark: Story = { render: () => <Panel title="Hindcast dark" theme="dark" className="hc-dark" /> };
