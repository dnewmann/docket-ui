import { useId, useState, type ReactNode } from 'react';
import styles from './Accordion.module.css';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several sections open at once. */
  multiple?: boolean;
  defaultOpen?: string[];
  /** Heading level for the section titles, to fit the page outline. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/** Expandable sections (WAI-ARIA accordion): each title is a button inside a heading. */
export function Accordion({ items, multiple, defaultOpen = [], headingLevel = 3, className }: AccordionProps) {
  const id = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const Heading = `h${headingLevel}` as 'h3';

  function toggle(itemId: string) {
    setOpen((prev) =>
      prev.includes(itemId) ? prev.filter((x) => x !== itemId) : multiple ? [...prev, itemId] : [itemId],
    );
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className={styles.item}>
            <Heading className={styles.heading}>
              <button
                type="button"
                id={`${id}-${item.id}-button`}
                aria-expanded={isOpen}
                aria-controls={`${id}-${item.id}-panel`}
                className={styles.trigger}
                onClick={() => toggle(item.id)}
              >
                {item.title}
                <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.chevron}>
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>
            </Heading>
            <div
              id={`${id}-${item.id}-panel`}
              role="region"
              aria-labelledby={`${id}-${item.id}-button`}
              hidden={!isOpen}
              className={styles.panel}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
