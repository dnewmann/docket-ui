import { useId, type ReactNode } from 'react';
import styles from './Field.module.css';

export interface FieldA11yProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
}

export interface FieldProps {
  label: ReactNode;
  /** Help text shown under the control. */
  hint?: ReactNode;
  /** Error message. When set, the control is marked invalid and the message replaces the hint. */
  error?: ReactNode;
  required?: boolean;
  /** Visually hide the label but keep it for screen readers. */
  hideLabel?: boolean;
  id?: string;
  className?: string;
  /** Receives the ids and ARIA attributes to spread onto the control. */
  children: (a11y: FieldA11yProps) => ReactNode;
}

/**
 * Internal layout for labelled form controls. Owns the label, hint and error
 * text and wires them to the control with ids, so every field is announced
 * the same way by screen readers.
 */
export function Field({ label, hint, error, required, hideLabel, id, className, children }: FieldProps) {
  const autoId = useId();
  const controlId = id ?? `dk-field-${autoId}`;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={controlId} className={hideLabel ? styles.visuallyHidden : styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children({
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
      })}
      {error ? (
        <p id={errorId} className={styles.error}>
          <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.errorIcon}>
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.5v4M8 11h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
