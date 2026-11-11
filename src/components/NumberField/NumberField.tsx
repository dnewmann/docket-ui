import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Field, fieldStyles } from '../Field';
import styles from './NumberField.module.css';

export type NumberFormat = 'currency' | 'percent' | 'decimal';

export interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'> {
  label: ReactNode;
  /** The number, or null when empty or not a valid number. Percent values are fractions: 0.07 means 7%. */
  value: number | null;
  onValueChange: (value: number | null) => void;
  format?: NumberFormat;
  /** ISO currency code for format="currency". */
  currency?: string;
  locale?: string;
  /** Digits shown after the decimal point when not editing. Defaults to 2 for currency, else up to 2. */
  fractionDigits?: number;
  hint?: ReactNode;
  error?: ReactNode;
  hideLabel?: boolean;
}

function parse(text: string, format: NumberFormat): number | null {
  const cleaned = text.replace(/[\s,$%]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return format === 'percent' ? n / 100 : n;
}

/** The editable text for a value: no grouping, percent as a whole number (0.07 -> "7"). */
function toEditText(value: number | null, format: NumberFormat): string {
  if (value === null) return '';
  const n = format === 'percent' ? value * 100 : value;
  return String(Number(n.toPrecision(12)));
}

/**
 * A text input for money, percentages and plain numbers. It shows grouped,
 * formatted numbers at rest ("1,234.50") and plain digits while editing, and
 * reports a parsed number (or null) so callers never handle strings.
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    label,
    value,
    onValueChange,
    format = 'decimal',
    currency = 'USD',
    locale = 'en-US',
    fractionDigits,
    hint,
    error,
    hideLabel,
    required,
    id,
    className,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const [draft, setDraft] = useState<string | null>(null); // non-null while focused
  const digits = fractionDigits ?? (format === 'currency' ? 2 : undefined);

  const display =
    value === null
      ? ''
      : new Intl.NumberFormat(locale, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits ?? 2,
        }).format(format === 'percent' ? value * 100 : value);

  const symbol =
    format === 'currency'
      ? (new Intl.NumberFormat(locale, { style: 'currency', currency })
          .formatToParts(0)
          .find((p) => p.type === 'currency')?.value ?? currency)
      : null;

  return (
    <Field label={label} hint={hint} error={error} required={required} hideLabel={hideLabel} id={id} className={className}>
      {(a11y) => (
        <div className={styles.wrapper}>
          {symbol && (
            <span className={styles.prefix} aria-hidden="true">
              {symbol}
            </span>
          )}
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            required={required}
            className={[fieldStyles.control, styles.input, symbol && styles.withPrefix, format === 'percent' && styles.withSuffix]
              .filter(Boolean)
              .join(' ')}
            value={draft ?? display}
            onFocus={(event) => {
              setDraft(toEditText(value, format));
              onFocus?.(event);
            }}
            onChange={(event) => {
              setDraft(event.target.value);
              onValueChange(parse(event.target.value, format));
            }}
            onBlur={(event) => {
              setDraft(null);
              onBlur?.(event);
            }}
            {...a11y}
            {...rest}
          />
          {format === 'percent' && (
            <span className={styles.suffix} aria-hidden="true">
              %
            </span>
          )}
        </div>
      )}
    </Field>
  );
});
