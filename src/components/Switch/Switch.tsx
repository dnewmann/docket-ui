import { forwardRef, useId, useImperativeHandle, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  label: ReactNode;
  description?: ReactNode;
  /** Controlled state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * An on/off setting that takes effect immediately. Use Checkbox instead when
 * the choice is submitted later with a form.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, description, checked, defaultChecked = false, onCheckedChange, id, className, disabled, onClick, ...rest },
  ref,
) {
  const autoId = useId();
  const switchId = id ?? `dk-switch-${autoId}`;
  const labelId = `${switchId}-label`;
  const descriptionId = description ? `${switchId}-description` : undefined;

  const buttonRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : internal;

  return (
    <div className={[styles.root, disabled && styles.disabled, className].filter(Boolean).join(' ')}>
      <button
        ref={buttonRef}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        disabled={disabled}
        className={styles.track}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (!isControlled) setInternal(!isOn);
          onCheckedChange?.(!isOn);
        }}
        {...rest}
      >
        <span className={styles.thumb} aria-hidden="true" />
      </button>
      <span className={styles.text}>
        {/* Clicking the visible label toggles too, like a native <label>. */}
        <span id={labelId} className={styles.label} onClick={() => !disabled && buttonRef.current?.click()}>
          {label}
        </span>
        {description && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}
      </span>
    </div>
  );
});
