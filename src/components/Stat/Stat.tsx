import type { ReactNode } from 'react';
import styles from './Stat.module.css';

export interface StatProps {
  label: ReactNode;
  /** The main figure, already formatted (e.g. "$12,480.20"). */
  value: ReactNode;
  /** Change as a fraction: 0.052 shows "+5.2%". */
  delta?: number;
  /** What the change is measured against, e.g. "since purchase". */
  deltaLabel?: ReactNode;
  /** Set when a decrease is good, such as fees or volatility. */
  invertDelta?: boolean;
  hint?: ReactNode;
  locale?: string;
  className?: string;
}

/**
 * A single metric with an optional change. Direction is shown with an arrow,
 * a sign and words for screen readers, not color alone.
 */
export function Stat({ label, value, delta, deltaLabel, invertDelta, hint, locale = 'en-US', className }: StatProps) {
  const direction = delta === undefined || delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down';
  const good = direction === 'flat' ? 'flat' : (direction === 'up') !== Boolean(invertDelta) ? 'up' : 'down';
  const formatted =
    delta === undefined
      ? null
      : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 2, signDisplay: 'exceptZero' }).format(delta);

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {formatted && (
        <p className={[styles.delta, styles[good]].join(' ')}>
          <span aria-hidden="true">{direction === 'up' ? '▲' : direction === 'down' ? '▼' : '■'}</span>
          <span className={styles.srOnly}>{direction === 'up' ? 'Up ' : direction === 'down' ? 'Down ' : 'No change '}</span>
          {formatted}
          {deltaLabel && <span className={styles.deltaLabel}> {deltaLabel}</span>}
        </p>
      )}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
