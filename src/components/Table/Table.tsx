import { useMemo, useState, type ReactNode } from 'react';
import styles from './Table.module.css';

export type SortDirection = 'ascending' | 'descending';
export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface TableColumn<T> {
  key: string;
  /** Column heading. Also used as the field label in the stacked (narrow) layout. */
  header: string;
  /** Cell content. Defaults to `row[key]`. */
  cell?: (row: T) => ReactNode;
  /** Makes the column sortable by this value. */
  sortValue?: (row: T) => string | number | Date;
  align?: 'start' | 'end';
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Describes the table for screen readers. Required; hide it visually with `hideCaption`. */
  caption: string;
  hideCaption?: boolean;
  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState) => void;
  /** Shown in place of rows when `rows` is empty. */
  empty?: ReactNode;
  className?: string;
}

/**
 * A semantic <table> with sortable columns. Sorting uses real buttons inside
 * the headers and reports state with aria-sort. When its container is narrow
 * (a container query, not a viewport query), rows restack as labelled cards,
 * so the same table works in a phone layout or a narrow side panel.
 */
export function Table<T>({
  columns,
  rows,
  rowKey,
  caption,
  hideCaption,
  sort,
  defaultSort = null,
  onSortChange,
  empty,
  className,
}: TableProps<T>) {
  const isControlled = sort !== undefined;
  const [internalSort, setInternalSort] = useState<SortState | null>(defaultSort);
  const activeSort = isControlled ? sort : internalSort;

  const sortedRows = useMemo(() => {
    if (!activeSort) return rows;
    const column = columns.find((c) => c.key === activeSort.key);
    if (!column?.sortValue) return rows;
    const factor = activeSort.direction === 'ascending' ? 1 : -1;
    // Copy before sorting: never mutate the caller's array.
    return [...rows].sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      if (av instanceof Date && bv instanceof Date) return (av.getTime() - bv.getTime()) * factor;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor;
      return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' }) * factor;
    });
  }, [rows, columns, activeSort]);

  function toggleSort(key: string) {
    const next: SortState =
      activeSort?.key === key && activeSort.direction === 'ascending'
        ? { key, direction: 'descending' }
        : { key, direction: 'ascending' };
    if (!isControlled) setInternalSort(next);
    onSortChange?.(next);
  }

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      {/* Explicit roles: some browsers drop table semantics when CSS changes `display`,
          which the narrow, stacked layout does. */}
      <table className={styles.table} role="table">
        <caption className={hideCaption ? styles.visuallyHidden : styles.caption}>{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            {columns.map((column) => {
              const sorted = activeSort?.key === column.key ? activeSort.direction : undefined;
              return (
                <th
                  key={column.key}
                  scope="col"
                  role="columnheader"
                  aria-sort={column.sortValue ? (sorted ?? 'none') : undefined}
                  className={column.align === 'end' ? styles.end : undefined}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.sortValue ? (
                    <button type="button" className={styles.sortButton} onClick={() => toggleSort(column.key)}>
                      {column.header}
                      <svg
                        className={[styles.sortIcon, sorted && styles.sortActive].filter(Boolean).join(' ')}
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        {sorted === 'descending' ? (
                          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        ) : sorted === 'ascending' ? (
                          <path d="M4 10l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        ) : (
                          <path d="M5 6.5l3-3 3 3M5 9.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        )}
                      </svg>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {sortedRows.length === 0 ? (
            <tr className={styles.emptyRow} role="row">
              <td colSpan={columns.length} className={styles.empty} role="cell">
                {empty ?? 'No results'}
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => (
              <tr key={rowKey(row)} role="row">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    role="cell"
                    data-label={column.header}
                    className={column.align === 'end' ? styles.end : undefined}
                  >
                    {column.cell ? column.cell(row) : String((row as Record<string, unknown>)[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
