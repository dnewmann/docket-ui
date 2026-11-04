import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: ReactNode;
  /** Secondary line under the label. */
  description?: ReactNode;
  /** Mixed state, for "select all" when only some children are checked. */
  indeterminate?: boolean;
}

/**
 * A native checkbox with a custom visual. The real input stays in the DOM and
 * receives focus, so keyboard (Space), forms and screen readers work natively.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, id, className, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `dk-checkbox-${autoId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

  // `indeterminate` is a DOM property, not an attribute, so it must be set imperatively.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={[styles.root, disabled && styles.disabled, className].filter(Boolean).join(' ')}>
      <span className={styles.control}>
        <input
          ref={innerRef}
          id={inputId}
          type="checkbox"
          className={styles.input}
          disabled={disabled}
          aria-describedby={descriptionId}
          {...rest}
        />
        <span className={styles.box} aria-hidden="true">
          <svg className={styles.check} viewBox="0 0 16 16">
            <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg className={styles.dash} viewBox="0 0 16 16">
            <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </span>
      <span className={styles.text}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        {description && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}
      </span>
    </div>
  );
});
