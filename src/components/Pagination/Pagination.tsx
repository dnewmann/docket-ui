import styles from './Pagination.module.css';

export interface PaginationProps {
  /** Current page, starting at 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current page before collapsing to "…". */
  siblings?: number;
  className?: string;
}

/** Page numbers to show, with "gap" where pages are collapsed. Exported for testing. */
export function pageItems(page: number, pageCount: number, siblings = 1): (number | 'gap')[] {
  const pages = new Set<number>([1, pageCount]);
  for (let p = page - siblings; p <= page + siblings; p++) if (p >= 1 && p <= pageCount) pages.add(p);
  const sorted = [...pages].sort((a, b) => a - b);
  const items: (number | 'gap')[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev === 2) items.push(prev + 1);
    else if (prev !== undefined && p - prev > 2) items.push('gap');
    items.push(p);
  });
  return items;
}

/** Moves between pages of results. The current page is marked with aria-current. */
export function Pagination({ page, pageCount, onPageChange, siblings = 1, className }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Pagination" className={[styles.root, className].filter(Boolean).join(' ')}>
      <button type="button" className={styles.button} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <span aria-hidden="true">‹</span> Previous
      </button>
      <ul className={styles.list}>
        {pageItems(page, pageCount, siblings).map((item, i) =>
          item === 'gap' ? (
            <li key={`gap-${i}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={styles.page}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>
      <button type="button" className={styles.button} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
        Next <span aria-hidden="true">›</span>
      </button>
    </nav>
  );
}
