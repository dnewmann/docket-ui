import { cloneElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  /** Short supporting text. Never put essential information only in a tooltip. */
  content: ReactNode;
  /** One focusable element, such as a Button or an icon button with an aria-label. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  placement?: 'top' | 'bottom';
  /** Delay before showing on hover, in ms. Focus shows it immediately. */
  delay?: number;
}

/**
 * Shows a short description on hover and keyboard focus, linked to the trigger
 * with aria-describedby. Escape dismisses it, as WCAG 1.4.13 requires.
 */
export function Tooltip({ content, children, placement = 'top', delay = 300 }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = (wait: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  const describedBy = [children.props['aria-describedby'], open ? id : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <span
      className={styles.root}
      onMouseEnter={() => show(delay)}
      onMouseLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
    >
      {cloneElement(children, { 'aria-describedby': describedBy })}
      {open && (
        <span id={id} role="tooltip" className={[styles.tip, styles[placement]].join(' ')}>
          {content}
        </span>
      )}
    </span>
  );
}
