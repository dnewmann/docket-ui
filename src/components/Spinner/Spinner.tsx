import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  /** Announced to screen readers. */
  label?: string;
  className?: string;
}

/** An indeterminate loading indicator with an accessible label. */
export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
  return (
    <span role="status" className={[styles.root, styles[size], className].filter(Boolean).join(' ')}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.svg}>
        <circle cx="12" cy="12" r="9" className={styles.track} />
        <path d="M21 12a9 9 0 0 0-9-9" className={styles.arc} />
      </svg>
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}
