import { useId, type ReactNode } from 'react';
import styles from './Progress.module.css';

export interface ProgressProps {
  label: ReactNode;
  value: number;
  max?: number;
  /** Text shown at the right, e.g. "$42,000 of $100,000". Defaults to a percentage. */
  valueLabel?: ReactNode;
  hideValue?: boolean;
  className?: string;
}

/** A determinate progress bar toward a goal, exposed as role="progressbar". */
export function Progress({ label, value, max = 100, valueLabel, hideValue, className }: ProgressProps) {
  const id = useId();
  const clamped = Math.min(Math.max(value, 0), max);
  const pct = max > 0 ? clamped / max : 0;
  const text = valueLabel ?? `${Math.round(pct * 100)}%`;
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <span id={`${id}-label`} className={styles.label}>
          {label}
        </span>
        {!hideValue && <span className={styles.value}>{text}</span>}
      </div>
      <div
        role="progressbar"
        aria-labelledby={`${id}-label`}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={typeof text === 'string' ? text : undefined}
        className={styles.track}
      >
        <div className={styles.fill} style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}
