import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Accessible name for the tab list, e.g. "Portfolio views". */
  label: string;
  /** Controlled selected tab id. */
  value?: string;
  /** Initial tab id when uncontrolled. Defaults to the first enabled tab. */
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
}

/**
 * Switches between views in the same context, following the WAI-ARIA tabs
 * pattern: arrow keys move between tabs, Home and End jump to the ends, and
 * only the selected tab is in the Tab order.
 */
export function Tabs({ items, label, value, defaultValue, onValueChange, className }: TabsProps) {
  const baseId = useId();
  const enabled = items.filter((t) => !t.disabled);
  const [internal, setInternal] = useState(defaultValue ?? enabled[0]?.id);
  const selected = value ?? internal;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(id: string) {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = enabled.findIndex((t) => t.id === selected);
    let next: TabItem | undefined;
    if (event.key === 'ArrowRight') next = enabled[(index + 1) % enabled.length];
    else if (event.key === 'ArrowLeft') next = enabled[(index - 1 + enabled.length) % enabled.length];
    else if (event.key === 'Home') next = enabled[0];
    else if (event.key === 'End') next = enabled[enabled.length - 1];
    if (!next) return;
    event.preventDefault();
    select(next.id);
    tabRefs.current[next.id]?.focus();
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <div role="tablist" aria-label={label} className={styles.list}>
        {items.map((tab) => {
          const isSelected = tab.id === selected;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              id={`${baseId}-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              disabled={tab.disabled}
              className={styles.tab}
              onClick={() => select(tab.id)}
              onKeyDown={onKeyDown}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {items.map((tab) => (
        <div
          key={tab.id}
          id={`${baseId}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== selected}
          tabIndex={0}
          className={styles.panel}
        >
          {tab.id === selected && tab.content}
        </div>
      ))}
    </div>
  );
}
