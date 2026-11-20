import type { Status } from '../api/types.ts';
import styles from './StatusBadge.module.css';

const LABELS: Record<Status, string> = {
  available: 'Available',
  on_loan: 'On loan',
  reserved: 'Reserved',
  overdue: 'Overdue',
  returned: 'Returned',
};

/** The status of a book, a copy or a loan, in words and in a color of its own. */
export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`} data-status={status}>
      <span aria-hidden="true" className={styles.dot} />
      {LABELS[status]}
    </span>
  );
}
