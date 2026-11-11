import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  /** Usually one primary Button that resolves the empty state. */
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** What to show when there's no data yet: what this area is for, and the next step. */
export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <span className={styles.icon} aria-hidden="true">
        {icon ?? (
          <svg viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 10h18" />
          </svg>
        )}
      </span>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
