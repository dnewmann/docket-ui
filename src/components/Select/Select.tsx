import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { Field, fieldStyles } from '../Field';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: ReactNode;
  options: SelectOption[];
  /** Shown as a first, unselectable option until the user picks a value. */
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  hideLabel?: boolean;
}

/**
 * A styled native select. Native keeps full keyboard, screen reader and mobile
 * picker support for free; use Combobox when users need to search.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, hint, error, hideLabel, required, id, className, defaultValue, value, ...rest },
  ref,
) {
  const isControlled = value !== undefined;
  return (
    <Field label={label} hint={hint} error={error} required={required} hideLabel={hideLabel} id={id} className={className}>
      {(a11y) => (
        <div className={styles.wrapper}>
          <select
            ref={ref}
            required={required}
            className={[fieldStyles.control, styles.select].join(' ')}
            {...(isControlled ? { value } : { defaultValue: defaultValue ?? (placeholder ? '' : undefined) })}
            {...a11y}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </Field>
  );
});
