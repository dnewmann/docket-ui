import { useEffect, useId, useRef, type ReactNode } from 'react';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  /** Called on Escape, the close button, a backdrop click, or `requestClose` from children. */
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Actions row, usually a secondary and a primary Button. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Close when the dimmed backdrop is clicked. Turn off for forms with unsaved input. */
  closeOnBackdrop?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A modal dialog built on the native <dialog> element. `showModal()` puts it in
 * the top layer and makes the rest of the page inert, so focus cannot wander
 * behind it. The component adds what the platform leaves out: initial focus,
 * returning focus to the trigger, and close handling that stays controlled by React.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      // Initial focus: an [autofocus] element, else the first control in the body,
      // else the first focusable anywhere (the close button).
      const body = dialog.querySelector<HTMLElement>(`.${styles.body}`);
      const target =
        dialog.querySelector<HTMLElement>('[autofocus]') ??
        body?.querySelector<HTMLElement>(FOCUSABLE) ??
        dialog.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? dialog).focus();
    } else if (!open && dialog.open) {
      dialog.close();
      returnFocusRef.current?.focus();
      returnFocusRef.current = null;
    }
  }, [open]);

  // If the component unmounts while open, still hand focus back.
  useEffect(() => {
    return () => {
      returnFocusRef.current?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={[styles.dialog, styles[size]].join(' ')}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Keep open/closed state owned by React: block the browser's own Escape close.
      onCancel={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      }}
      onClick={(event) => {
        // A click on the <dialog> element itself (not its content) lands on the backdrop.
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
    >
      {open && (
        <div className={styles.panel}>
          <header className={styles.header}>
            <div>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className={styles.description}>
                  {description}
                </p>
              )}
            </div>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close dialog">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </header>
          {children && <div className={styles.body}>{children}</div>}
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
