import type { ReactNode } from 'react';
import styles from './Alert.module.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Shows a dismiss button. */
  onDismiss?: () => void;
  className?: string;
}

const icons: Record<AlertTone, ReactNode> = {
  info: <path d="M12 8h.01M11 12h1v5h1" />,
  success: <path d="M8 12.5l3 3 5-6" />,
  warning: <path d="M12 8v5M12 16h.01" />,
  danger: <path d="M9 9l6 6M15 9l-6 6" />,
};

/**
 * An inline message about the page or a task. Warnings and errors are
 * announced immediately (role="alert"); info and success politely (role="status").
 */
export function Alert({ tone = 'info', title, children, onDismiss, className }: AlertProps) {
  const urgent = tone === 'warning' || tone === 'danger';
  return (
    <div role={urgent ? 'alert' : 'status'} className={[styles.alert, styles[tone], className].filter(Boolean).join(' ')}>
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        {icons[tone]}
      </svg>
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.text}>{children}</div>}
      </div>
      {onDismiss && (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>
      )}
    </div>
  );
}
