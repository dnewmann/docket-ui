import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '../index';
import styles from './GuidedTour.module.css';

export interface TourStep {
  /** Matches a `data-tour` attribute on the element to highlight. */
  target: string;
  title: string;
  body: string;
}

interface GuidedTourProps {
  steps: TourStep[];
  open: boolean;
  onClose: () => void;
}

/**
 * Onboarding tour: highlights one section at a time and explains it in a
 * tooltip-style popover. Non-modal (the page stays usable), but focus moves into
 * the popover, Escape exits, and the caller returns focus to the help button.
 */
export function GuidedTour({ steps, open, onClose }: GuidedTourProps) {
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number; placement: 'below' | 'above' }>({
    top: 0,
    left: 0,
    placement: 'below',
  });
  const popoverRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const bodyId = useId();
  const step = steps[index];

  // Restart from the first step each time the tour opens.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setIndex(0);
  }

  // Highlight the target and place the popover next to it.
  useLayoutEffect(() => {
    if (!open || !step) return;
    const target = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!target) return;
    target.setAttribute('data-tour-active', '');
    target.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });

    const place = () => {
      const rect = target.getBoundingClientRect();
      const width = popoverRef.current?.offsetWidth ?? 320;
      const height = popoverRef.current?.offsetHeight ?? 160;
      const gap = 14;
      const below = rect.bottom + gap + height < window.innerHeight;
      const left = Math.min(Math.max(16, rect.left), window.innerWidth - width - 16);
      setPos({
        top: below ? rect.bottom + gap : Math.max(16, rect.top - gap - height),
        left,
        placement: below ? 'below' : 'above',
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      target.removeAttribute('data-tour-active');
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, step]);

  // Move focus into the popover on open and on every step change.
  useEffect(() => {
    if (open) popoverRef.current?.focus();
  }, [open, index]);

  if (!open || !step) return null;
  const last = index === steps.length - 1;

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      tabIndex={-1}
      className={[styles.popover, styles[pos.placement]].join(' ')}
      style={{ top: pos.top, left: pos.left }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <p className={styles.counter}>
        Step {index + 1} of {steps.length}
      </p>
      <h2 id={titleId} className={styles.title}>
        {step.title}
      </h2>
      <p id={bodyId} className={styles.body}>
        {step.body}
      </p>
      <div className={styles.actions}>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Skip tour
        </Button>
        <span className={styles.spacer} />
        {index > 0 && (
          <Button variant="secondary" size="sm" onClick={() => setIndex((i) => i - 1)}>
            Back
          </Button>
        )}
        <Button size="sm" onClick={() => (last ? onClose() : setIndex((i) => i + 1))}>
          {last ? 'Done' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
