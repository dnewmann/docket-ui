import { useMemo, useState, type FormEvent } from 'react';
import { Button, Checkbox, Combobox, Modal, Select, Switch, Table, TextField } from '../index';
import type { ComboboxOption, TableColumn } from '../index';
import { clientOptions, matters as seed, searchMatters, type Matter, type MatterStatus } from './matters-data';
import styles from './MattersDashboard.module.css';

const TODAY = new Date('2026-11-03T12:00:00');
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const hoursFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

function daysUntil(iso: string) {
  return Math.round((new Date(`${iso}T12:00:00`).getTime() - TODAY.getTime()) / 86_400_000);
}

function StatusPill({ status }: { status: MatterStatus }) {
  const tone = status === 'Open' ? styles.success : status === 'On hold' ? styles.warning : styles.neutral;
  return <span className={[styles.pill, tone].join(' ')}>{status}</span>;
}

const columns: TableColumn<Matter>[] = [
  {
    key: 'name',
    header: 'Matter',
    sortValue: (m) => m.name,
    cell: (m) => (
      <span className={styles.matterCell}>
        <a href={`#matter-${m.number}`} className={styles.matterLink}>
          {m.name}
        </a>
        <span className={styles.muted}>{m.number}</span>
      </span>
    ),
  },
  { key: 'client', header: 'Client', sortValue: (m) => m.client },
  { key: 'area', header: 'Practice area', sortValue: (m) => m.area },
  { key: 'status', header: 'Status', sortValue: (m) => m.status, cell: (m) => <StatusPill status={m.status} /> },
  {
    key: 'due',
    header: 'Due',
    sortValue: (m) => m.due,
    cell: (m) => {
      const d = daysUntil(m.due);
      const soon = m.status !== 'Closed' && d >= 0 && d <= 7;
      return (
        <span className={soon ? styles.dueSoon : undefined}>
          {dateFmt.format(new Date(`${m.due}T12:00:00`))}
          {soon && <span className={styles.visuallyHidden}> (due within a week)</span>}
        </span>
      );
    },
  },
  { key: 'hours', header: 'Hours', align: 'end', sortValue: (m) => m.hours, cell: (m) => hoursFmt.format(m.hours) },
];

const NavIcon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.navIcon}>
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const nav = [
  { label: 'Matters', d: 'M4 6h16M4 12h16M4 18h10', current: true },
  { label: 'Calendar', d: 'M5 5h14v14H5zM5 9h14M9 3v4M15 3v4' },
  { label: 'Clients', d: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M17 11a2.5 2.5 0 1 0 0-5M18 15c2 .4 4 2 4 5' },
  { label: 'Billing', d: 'M4 7h16v10H4zM4 11h16M8 15h3' },
];

/**
 * A full product screen built only from Docket UI: app shell, async search,
 * stats, filters, a sortable responsive table, and a modal create flow.
 */
export function MattersDashboard() {
  const [rows, setRows] = useState<Matter[]>(seed);
  const [status, setStatus] = useState<'all' | MatterStatus>('all');
  const [onlyMine, setOnlyMine] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [client, setClient] = useState<ComboboxOption | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [announcement, setAnnouncement] = useState('');

  const visible = useMemo(
    () => rows.filter((m) => (status === 'all' || m.status === status) && (!onlyMine || m.mine)),
    [rows, status, onlyMine],
  );

  const open = rows.filter((m) => m.status === 'Open');
  const stats = [
    { label: 'Open matters', value: String(open.length) },
    { label: 'Due this week', value: String(open.filter((m) => daysUntil(m.due) >= 0 && daysUntil(m.due) <= 7).length) },
    { label: 'Hours logged', value: hoursFmt.format(rows.reduce((sum, m) => sum + m.hours, 0)) },
    { label: 'On hold', value: String(rows.filter((m) => m.status === 'On hold').length) },
  ];

  function closeModal() {
    setModalOpen(false);
    setErrors({});
    setClient(null);
  }

  function createMatter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const area = String(data.get('area') ?? '');
    const next: Record<string, string> = {};
    if (!name) next.name = 'Enter a matter name';
    if (!client) next.client = 'Choose a client';
    if (!area) next.area = 'Pick a practice area';
    setErrors(next);
    if (Object.keys(next).length) return;

    const number = `26-0${480 + rows.length}`;
    setRows((prev) => [
      { id: String(Date.now()), number, name, client: client!.label, area, status: 'Open', due: '2026-12-01', hours: 0, mine: true },
      ...prev,
    ]);
    setAnnouncement(`Matter ${number}, ${name}, created.`);
    closeModal();
  }

  return (
    <div className={styles.shell}>
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="var(--dk-color-action-primary)" />
            <path d="M9 8h7.5a8 8 0 0 1 0 16H9z" fill="none" stroke="var(--dk-color-action-on-primary)" strokeWidth="3" strokeLinejoin="round" />
          </svg>
          <span>Docket</span>
        </div>
        <div className={styles.search}>
          <Combobox
            label="Search matters"
            hideLabel
            placeholder="Search matters, clients or numbers"
            loadOptions={searchMatters}
            minChars={2}
            emptyMessage="No matters found"
            onChange={(option) => option && setAnnouncement(`Opening ${option.label}`)}
          />
        </div>
        <span className={styles.avatar} role="img" aria-label="Signed in as Dana Reyes">
          DR
        </span>
      </header>

      <nav className={styles.sidenav} aria-label="Main">
        <ul>
          {nav.map((item) => (
            <li key={item.label}>
              <a href={`#${item.label.toLowerCase()}`} aria-current={item.current ? 'page' : undefined} className={styles.navLink}>
                <NavIcon d={item.d} />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main id="main" className={styles.main} tabIndex={-1}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.h1}>Matters</h1>
            <p className={styles.subtitle}>Every matter your team is working on, as of Nov 3.</p>
          </div>
          <Button onClick={() => setModalOpen(true)}>New matter</Button>
        </div>

        <section aria-label="Summary" className={styles.stats}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statValue}>{s.value}</span>
            </div>
          ))}
        </section>

        <div className={styles.filters}>
          <Select
            label="Status"
            className={styles.statusFilter}
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'Open', label: 'Open' },
              { value: 'On hold', label: 'On hold' },
              { value: 'Closed', label: 'Closed' },
            ]}
          />
          <Switch label="Only my matters" checked={onlyMine} onCheckedChange={setOnlyMine} />
          <span className={styles.count} aria-live="polite">
            {visible.length} of {rows.length} matters
          </span>
        </div>

        <Table
          caption="Matters"
          hideCaption
          columns={columns}
          rows={visible}
          rowKey={(m) => m.id}
          defaultSort={{ key: 'due', direction: 'ascending' }}
          empty="No matters match these filters."
        />

        <p role="status" className={styles.visuallyHidden}>
          {announcement}
        </p>
      </main>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="New matter"
        description="Opens a matter and notifies the assigned team."
        closeOnBackdrop={false}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" form="new-matter-form">
              Create matter
            </Button>
          </>
        }
      >
        <form id="new-matter-form" noValidate onSubmit={createMatter} className={styles.form}>
          <TextField name="name" label="Matter name" required placeholder="e.g. Acme v. Globex" error={errors.name} />
          <Combobox
            label="Client"
            required
            options={clientOptions}
            value={client}
            onChange={setClient}
            placeholder="Search clients"
            error={errors.client}
          />
          <Select
            name="area"
            label="Practice area"
            required
            placeholder="Choose an area"
            error={errors.area}
            options={[
              { value: 'Litigation', label: 'Litigation' },
              { value: 'Mergers & Acquisitions', label: 'Mergers & Acquisitions' },
              { value: 'Intellectual Property', label: 'Intellectual Property' },
              { value: 'Employment', label: 'Employment' },
              { value: 'Regulatory', label: 'Regulatory' },
            ]}
          />
          <Checkbox name="privileged" label="Privileged" description="Excluded from exports shared outside the firm" />
        </form>
      </Modal>
    </div>
  );
}
