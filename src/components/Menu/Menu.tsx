import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import styles from './Menu.module.css';

export interface MenuItem {
  id: string;
  label: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  /** Destructive actions are styled as danger. */
  danger?: boolean;
}

export interface MenuProps {
  /** Text or content of the trigger button. */
  label: ReactNode;
  items: MenuItem[];
  align?: 'start' | 'end';
  className?: string;
}

/**
 * A menu button (WAI-ARIA pattern): Enter, Space or Arrow Down opens it and focuses
 * the first item; arrows, Home and End move; Escape or Tab closes and returns focus.
 */
export function Menu({ label, items, align = 'start', className }: MenuProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);

  useEffect(() => {
    if (open) itemRefs.current[active]?.focus();
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  function openAt(index: number) {
    setActive(index);
    setOpen(true);
  }

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function onTriggerKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAt(enabled[0] ?? 0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openAt(enabled[enabled.length - 1] ?? 0);
    }
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>) {
    const pos = enabled.indexOf(active);
    if (event.key === 'ArrowDown') setActive(enabled[(pos + 1) % enabled.length]);
    else if (event.key === 'ArrowUp') setActive(enabled[(pos - 1 + enabled.length) % enabled.length]);
    else if (event.key === 'Home') setActive(enabled[0]);
    else if (event.key === 'End') setActive(enabled[enabled.length - 1]);
    else if (event.key === 'Escape') close();
    else if (event.key === 'Tab') close(false);
    else return;
    if (event.key !== 'Tab') event.preventDefault();
  }

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(' ')}>
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        className={styles.trigger}
        onClick={() => (open ? close() : openAt(enabled[0] ?? 0))}
        onKeyDown={onTriggerKey}
      >
        {label}
        <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.chevron}>
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div
          id={`${id}-menu`}
          role="menu"
          aria-labelledby={`${id}-trigger`}
          className={[styles.menu, styles[align]].join(' ')}
          onKeyDown={onMenuKey}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              role="menuitem"
              tabIndex={i === active ? 0 : -1}
              disabled={item.disabled}
              className={[styles.item, item.danger && styles.danger].filter(Boolean).join(' ')}
              onClick={() => {
                item.onSelect();
                close();
              }}
              onMouseEnter={() => !item.disabled && setActive(i)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
