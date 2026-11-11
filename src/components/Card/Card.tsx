import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  /** Buttons or links shown at the top right of the header. */
  actions?: ReactNode;
  footer?: ReactNode;
  /** "feature" adds the brand gradient. Use for at most one highlight per view. */
  variant?: 'default' | 'feature';
}

/** A surface that groups related content. With a title it becomes a labelled section. */
export function Card({ title, description, actions, footer, variant = 'default', children, className, ...rest }: CardProps) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={[styles.card, variant === 'feature' && styles.feature, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {(title || actions) && (
        <header className={styles.header}>
          <div>
            {title && (
              <h3 id={titleId} className={styles.title}>
                {title}
              </h3>
            )}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      {children}
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
}
