import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Field, fieldStyles } from '../Field';
import styles from './TextField.module.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  hideLabel?: boolean;
  /** Decorative icon inside the start of the input. */
  startIcon?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, hideLabel, startIcon, required, id, className, type = 'text', ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error} required={required} hideLabel={hideLabel} id={id} className={className}>
      {(a11y) => (
        <div className={styles.wrapper}>
          {startIcon && (
            <span className={styles.icon} aria-hidden="true">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            required={required}
            className={[fieldStyles.control, startIcon && styles.withIcon].filter(Boolean).join(' ')}
            {...a11y}
            {...rest}
          />
        </div>
      )}
    </Field>
  );
});
