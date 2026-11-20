import { Link } from 'react-router';
import type { Loan } from '../api/types.ts';
import { dueText, formatDay, formatReais } from '../format.ts';
import { useToday } from '../useToday.ts';
import { Icon } from './Icon.tsx';
import styles from './LoanTable.module.css';
import { StatusBadge } from './StatusBadge.tsx';
import ui from './ui.module.css';

interface LoanTableProps {
  loans: Loan[];
  /** The name of the table, for screen readers: 'Loans', 'Overdue loans'. */
  label: string;
  /** The reader page leaves the reader out: they are on the screen already. */
  showReader?: boolean;
  /** The loan whose action is on its way, which disables its buttons. */
  busyId?: number | null;
  onReturn?: (loan: Loan) => void;
  onRenew?: (loan: Loan) => void;
}

/** Loans in rows with their actions; where there is no room for the columns, each row is a card (LoanTable.module.css). */
export function LoanTable({ loans, label, showReader = true, busyId = null, onReturn, onRenew }: LoanTableProps) {
  const today = useToday();
  const actions = Boolean(onReturn || onRenew);
  return (
    <div className={styles.wrap}>
      <table className={styles.table} aria-label={label}>
        <thead>
          <tr>
            <th scope="col">Book</th>
            {showReader && <th scope="col">Reader</th>}
            <th scope="col">Due</th>
            <th scope="col">Status</th>
            <th scope="col">Fine</th>
            {actions && (
              <th scope="col">
                <span className={styles.hidden}>Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} data-testid={`loan-${loan.id}`}>
              <td data-label="Book">
                <Link to={`/books/${loan.book.id}`} className={styles.title}>
                  {loan.book.title}
                </Link>
                <span className={styles.code}>Copy {loan.copy.code}</span>
              </td>
              {showReader && (
                <td data-label="Reader" className={styles.reader}>
                  <Link to={`/readers/${loan.reader.id}`}>{loan.reader.name}</Link>
                </td>
              )}
              <td data-label="Due">
                <span>
                  {formatDay(loan.dueOn)}
                  {loan.status !== 'returned' && <span className={`${styles.code} ${loan.status === 'overdue' ? styles.late : ''}`}>{dueText(loan.dueOn, today)}</span>}
                  {loan.renewals > 0 && <span className={styles.code}>Renewed {loan.renewals}×</span>}
                </span>
              </td>
              <td data-label="Status">
                <StatusBadge status={loan.status} />
              </td>
              <td data-label="Fine" className={Number(loan.fine) > 0 ? styles.fine : undefined}>
                {Number(loan.fine) > 0 ? formatReais(Number(loan.fine)) : '—'}
              </td>
              {actions && (
                <td className={styles.actions}>
                  {loan.status !== 'returned' && onRenew && (
                    <button type="button" className={ui.button} disabled={busyId === loan.id} aria-label={`Renew ${loan.book.title}`} onClick={() => onRenew(loan)}>
                      <Icon name="renew" />
                      Renew
                    </button>
                  )}
                  {loan.status !== 'returned' && onReturn && (
                    <button type="button" className={ui.primary} disabled={busyId === loan.id} aria-label={`Return ${loan.book.title}`} onClick={() => onReturn(loan)}>
                      <Icon name="return" />
                      Return
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
