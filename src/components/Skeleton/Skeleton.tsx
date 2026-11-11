import type { CSSProperties } from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  /** Render this many text-like lines instead of one block. The last line is shorter. */
  lines?: number;
  circle?: boolean;
  className?: string;
}

/**
 * A placeholder shown while data loads. It is hidden from screen readers;
 * announce loading on the region instead (for example aria-busy="true").
 */
export function Skeleton({ width = '100%', height = '1em', lines, circle, className }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <span className={[styles.stack, className].filter(Boolean).join(' ')} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className={styles.block} style={{ width: i === lines - 1 ? '60%' : width, height }} />
        ))}
      </span>
    );
  }
  return (
    <span
      className={[styles.block, circle && styles.circle, className].filter(Boolean).join(' ')}
      style={{ width, height: circle ? width : height }}
      aria-hidden="true"
    />
  );
}
