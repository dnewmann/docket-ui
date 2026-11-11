import { forwardRef, useState, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { Field, fieldStyles } from '../Field';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  hideLabel?: boolean;
  /** Show "12 / 500" under the field. Requires maxLength. */
  showCount?: boolean;
}

/** Multi-line text input with the same label, hint and error wiring as TextField. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, hideLabel, showCount, required, id, className, rows = 4, maxLength, value, defaultValue, onChange, ...rest },
  ref,
) {
  const [count, setCount] = useState(String(value ?? defaultValue ?? '').length);
  const length = value !== undefined ? String(value).length : count;
  return (
    <Field label={label} hint={hint} error={error} required={required} hideLabel={hideLabel} id={id} className={className}>
      {(a11y) => (
        <>
          <textarea
            ref={ref}
            rows={rows}
            required={required}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={(event) => {
              setCount(event.target.value.length);
              onChange?.(event);
            }}
            className={[fieldStyles.control, styles.textarea].join(' ')}
            {...a11y}
            {...rest}
          />
          {showCount && maxLength !== undefined && (
            <span className={styles.count} aria-live="polite">
              {length} / {maxLength}
            </span>
          )}
        </>
      )}
    </Field>
  );
});
