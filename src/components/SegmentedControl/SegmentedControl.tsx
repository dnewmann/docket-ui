import { useId, useState, type ReactNode } from 'react';
import styles from './SegmentedControl.module.css';

export interface SegmentOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** Group name, e.g. "Time range". */
  label: string;
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Visually hide the label (it stays available to screen readers). */
  hideLabel?: boolean;
  className?: string;
}

/**
 * A compact single choice, like 1M / 1Y / 5Y. Built on native radio inputs,
 * so arrow keys, form semantics and screen readers work out of the box.
 */
export function SegmentedControl({ label, options, value, defaultValue, onValueChange, hideLabel, className }: SegmentedControlProps) {
  const name = useId();
  const [internal, setInternal] = useState(defaultValue ?? options.find((o) => !o.disabled)?.value);
  const selected = value ?? internal;

  return (
    <fieldset className={[styles.root, className].filter(Boolean).join(' ')}>
      <legend className={hideLabel ? styles.srOnly : styles.legend}>{label}</legend>
      <div className={styles.track}>
        {options.map((opt) => (
          <label key={opt.value} className={styles.segment}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected === opt.value}
              disabled={opt.disabled}
              className={styles.input}
              onChange={() => {
                if (value === undefined) setInternal(opt.value);
                onValueChange?.(opt.value);
              }}
            />
            <span className={styles.text}>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
