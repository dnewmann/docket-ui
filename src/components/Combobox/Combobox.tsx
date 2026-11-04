import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Field, fieldStyles } from '../Field';
import styles from './Combobox.module.css';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary text shown under the label, e.g. a client or matter number. */
  description?: string;
}

export interface ComboboxProps {
  label: ReactNode;
  /** Static options, filtered as the user types. Use `loadOptions` for server search instead. */
  options?: ComboboxOption[];
  /** Async search. Receives the query and an AbortSignal; stale requests are cancelled. */
  loadOptions?: (query: string, signal: AbortSignal) => Promise<ComboboxOption[]>;
  /** Delay before `loadOptions` runs, so we don't search on every keystroke. */
  debounceMs?: number;
  /** Characters required before searching. */
  minChars?: number;
  value?: ComboboxOption | null;
  defaultValue?: ComboboxOption | null;
  onChange?: (option: ComboboxOption | null) => void;
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  hideLabel?: boolean;
  disabled?: boolean;
  emptyMessage?: string;
  id?: string;
  className?: string;
}

/**
 * Editable combobox with a listbox popup, following the WAI-ARIA combobox
 * pattern: focus stays in the input while arrow keys move a virtual cursor
 * (aria-activedescendant) through the options.
 */
export function Combobox({
  label,
  options,
  loadOptions,
  debounceMs = 250,
  minChars = 0,
  value,
  defaultValue = null,
  onChange,
  placeholder,
  hint,
  error,
  required,
  hideLabel,
  disabled,
  emptyMessage = 'No results',
  id,
  className,
}: ComboboxProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<ComboboxOption | null>(defaultValue);
  const selected = isControlled ? value : internalValue;

  // While the list is open the input shows what the user typed; when closed it
  // shows the selected option. Deriving this (rather than syncing it in an effect)
  // means a controlled `value` changed from outside always shows correctly.
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputValue = open ? query : (selected?.label ?? '');
  const [activeIndex, setActiveIndex] = useState(-1);
  // Async results are stored with the query they answer, so "loading" can be derived:
  // we are loading whenever the latest results are for a different query.
  const [remote, setRemote] = useState<{ query: string; items: ComboboxOption[] }>({ query: '', items: [] });

  const listboxId = useId();
  const optionId = (index: number) => `${listboxId}-option-${index}`;
  const listRef = useRef<HTMLUListElement>(null);

  const trimmed = query.trim();
  const belowMin = !!loadOptions && trimmed.length < minChars;

  const localItems = useMemo(() => {
    if (!options) return [];
    const q = trimmed.toLowerCase();
    if (!q || q === selected?.label.toLowerCase()) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q),
    );
  }, [options, trimmed, selected]);

  // Async search: debounce, and abort the previous request when the query changes.
  useEffect(() => {
    if (!loadOptions || !open || belowMin) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      loadOptions(trimmed, controller.signal)
        .then((items) => {
          if (!controller.signal.aborted) setRemote({ query: trimmed, items });
        })
        .catch(() => {
          if (!controller.signal.aborted) setRemote({ query: trimmed, items: [] });
        });
    }, debounceMs);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [loadOptions, trimmed, open, belowMin, debounceMs]);

  const loading = !!loadOptions && open && !belowMin && remote.query !== trimmed;
  const items = loadOptions ? (belowMin || loading ? [] : remote.items) : localItems;

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (activeIndex < 0) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  function commit(option: ComboboxOption | null) {
    if (!isControlled) setInternalValue(option);
    onChange?.(option);
    setOpen(false);
    setActiveIndex(-1);
  }

  function openList() {
    if (disabled || open) return;
    setQuery(selected?.label ?? '');
    setOpen(true);
  }

  const status = loading
    ? 'Searching…'
    : belowMin
      ? `Type at least ${minChars} characters to search`
      : open
        ? items.length === 0
          ? emptyMessage
          : `${items.length} result${items.length === 1 ? '' : 's'} available`
        : '';

  return (
    <Field label={label} hint={hint} error={error} required={required} hideLabel={hideLabel} id={id} className={className}>
      {(a11y) => (
        <div className={styles.root}>
          <input
            {...a11y}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
            autoComplete="off"
            className={[fieldStyles.control, styles.input].join(' ')}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            value={inputValue}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(-1);
              setOpen(true);
              // Clearing the text clears the selection, but keeps the list open.
              if (event.target.value === '' && selected) {
                if (!isControlled) setInternalValue(null);
                onChange?.(null);
              }
            }}
            onFocus={openList}
            onClick={openList}
            onBlur={() => {
              setOpen(false);
              setActiveIndex(-1);
            }}
            onKeyDown={(event) => {
              switch (event.key) {
                case 'ArrowDown':
                  event.preventDefault();
                  if (!open) openList();
                  setActiveIndex((i) => (items.length ? (i + 1) % items.length : -1));
                  break;
                case 'ArrowUp':
                  event.preventDefault();
                  if (!open) openList();
                  setActiveIndex((i) => (items.length ? (i <= 0 ? items.length - 1 : i - 1) : -1));
                  break;
                case 'Home':
                  if (open && items.length) {
                    event.preventDefault();
                    setActiveIndex(0);
                  }
                  break;
                case 'End':
                  if (open && items.length) {
                    event.preventDefault();
                    setActiveIndex(items.length - 1);
                  }
                  break;
                case 'Enter':
                  if (open && activeIndex >= 0 && items[activeIndex]) {
                    event.preventDefault();
                    commit(items[activeIndex]);
                  }
                  break;
                case 'Escape':
                  if (open) {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpen(false);
                    setActiveIndex(-1);
                  }
                  break;
              }
            }}
          />
          <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={typeof label === 'string' ? label : undefined}
            className={styles.listbox}
            hidden={!open || (items.length === 0 && !loading && !belowMin && !trimmed)}
          >
            {loading || belowMin || items.length === 0 ? (
              <li className={styles.message} role="presentation">
                {status}
              </li>
            ) : (
              items.map((option, index) => (
                <li
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={selected?.value === option.value}
                  className={[styles.option, index === activeIndex && styles.active].filter(Boolean).join(' ')}
                  // mousedown, not click: keep focus in the input so blur doesn't close the list first.
                  onMouseDown={(event) => {
                    event.preventDefault();
                    commit(option);
                  }}
                  onMouseMove={() => setActiveIndex(index)}
                >
                  <span className={styles.optionLabel}>{option.label}</span>
                  {option.description && <span className={styles.optionDescription}>{option.description}</span>}
                  {selected?.value === option.value && (
                    <svg className={styles.check} viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
          <span className={styles.visuallyHidden} role="status" aria-live="polite">
            {open ? status : ''}
          </span>
        </div>
      )}
    </Field>
  );
}
