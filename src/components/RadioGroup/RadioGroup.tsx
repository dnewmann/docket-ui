import { useId, useState, type ReactNode } from 'react';
import styles from './RadioGroup.module.css';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label: ReactNode;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
}

/** One choice from a short list, with optional descriptions. Native radios in a fieldset. */
export function RadioGroup({ label, options, value, defaultValue, onValueChange, name, hint, error, required, className }: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const messageId = `${autoName}-msg`;
  const [internal, setInternal] = useState(defaultValue);
  const selected = value ?? internal;

  return (
    <fieldset
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-describedby={error || hint ? messageId : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className={styles.legend}>
        {label}
        {required && <span aria-hidden="true" className={styles.required}> *</span>}
      </legend>
      <div className={styles.options}>
        {options.map((opt) => {
          const descId = opt.description ? `${autoName}-${opt.value}-desc` : undefined;
          const labelId = `${autoName}-${opt.value}-label`;
          return (
            <label key={opt.value} className={styles.option}>
              <input
                type="radio"
                name={groupName}
                value={opt.value}
                checked={selected === opt.value}
                disabled={opt.disabled}
                required={required}
                aria-labelledby={labelId}
                aria-describedby={descId}
                className={styles.input}
                onChange={() => {
                  if (value === undefined) setInternal(opt.value);
                  onValueChange?.(opt.value);
                }}
              />
              <span>
                <span id={labelId} className={styles.label}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span id={descId} className={styles.description}>
                    {opt.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {(error || hint) && (
        <p id={messageId} className={error ? styles.error : styles.hint}>
          {error ?? hint}
        </p>
      )}
    </fieldset>
  );
}
