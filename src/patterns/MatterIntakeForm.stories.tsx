import { useState, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Checkbox, Select, Switch, TextField } from '../index';

/**
 * A realistic form built only from Docket UI components. Validates on submit,
 * shows inline errors, and moves focus to the first invalid field.
 */
function MatterIntakeForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next: Record<string, string> = {};
    if (!String(data.get('matter') ?? '').trim()) next.matter = 'Enter a matter name';
    if (!/^\d{6}$/.test(String(data.get('client') ?? ''))) next.client = 'Client ID must be six digits';
    if (!data.get('area')) next.area = 'Pick a practice area';
    setErrors(next);
    setSaved(false);

    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSaved(true);
    }, 1200);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      style={{
        display: 'grid',
        gap: 20,
        maxWidth: 440,
        padding: 24,
        borderRadius: 12,
        border: '1px solid var(--dk-color-border-subtle)',
        background: 'var(--dk-color-bg-surface)',
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 20 }}>New matter</h2>
        <p style={{ margin: '4px 0 0', color: 'var(--dk-color-text-secondary)', fontSize: 14 }}>
          Opens a matter and notifies the assigned team.
        </p>
      </div>
      <TextField name="matter" label="Matter name" placeholder="e.g. Acme v. Globex" required error={errors.matter} />
      <TextField
        name="client"
        label="Client ID"
        placeholder="000000"
        inputMode="numeric"
        required
        hint="Six digits, from the engagement letter"
        error={errors.client}
      />
      <Select
        name="area"
        label="Practice area"
        placeholder="Choose an area"
        required
        error={errors.area}
        options={[
          { value: 'litigation', label: 'Litigation' },
          { value: 'ma', label: 'Mergers & Acquisitions' },
          { value: 'ip', label: 'Intellectual Property' },
        ]}
      />
      <Checkbox name="privileged" label="Privileged" description="Excluded from exports shared outside the firm" />
      <Switch label="Notify team on creation" defaultChecked />
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" type="reset" onClick={() => setErrors({})}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} loadingLabel="Creating matter">
          Create matter
        </Button>
      </div>
      <p role="status" style={{ margin: 0, minHeight: 20, color: 'var(--dk-color-status-success)', fontSize: 14 }}>
        {saved ? 'Matter created.' : ''}
      </p>
    </form>
  );
}

const meta = {
  title: 'Patterns/Matter intake form',
  component: MatterIntakeForm,
  parameters: {
    docs: {
      description: {
        component:
          'Every control on this page comes from Docket UI. Submit it empty to see inline validation: errors are announced, and focus moves to the first invalid field.',
      },
    },
  },
} satisfies Meta<typeof MatterIntakeForm>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
