import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { getReader, getReaderLoans, payFines } from '../api/readers.ts';
import { ConfirmDialog } from '../components/ConfirmDialog.tsx';
import { Icon } from '../components/Icon.tsx';
import { LoanTable } from '../components/LoanTable.tsx';
import ui from '../components/ui.module.css';
import { finesDue, formatDay, formatMoment, formatReais, initials } from '../format.ts';
import { useLoanActions } from '../useLoanActions.ts';
import { useResource } from '../useResource.ts';
import { useToast } from '../useToast.ts';
import styles from './ReaderPage.module.css';

export function ReaderPage() {
  const id = Number(useParams().id);
  const toast = useToast();
  const reader = useResource(`reader-${id}`, (signal) => getReader(id, signal));
  const loans = useResource(`reader-loans-${id}`, (signal) => getReaderLoans(id, signal));
  const [confirming, setConfirming] = useState(false);
  const reload = () => {
    reader.reload();
    loans.reload();
  };
  const actions = useLoanActions(reload);

  if (reader.error) {
    return <p className={ui.alert}>{reader.error}</p>;
  }
  if (!reader.data || !loans.data) {
    return <p className={ui.muted}>Loading the reader…</p>;
  }
  const out = loans.data.filter((loan) => !loan.returnedAt);
  const history = loans.data.filter((loan) => loan.returnedAt);
  const due = finesDue(loans.data);

  async function pay() {
    setConfirming(false);
    try {
      await payFines(id);
      toast.success(`${formatReais(due)} in fines paid`);
      reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not mark the fines as paid');
    }
  }

  return (
    <article>
      <Link to="/readers" className={styles.back}>
        <Icon name="back" />
        Readers
      </Link>
      <header className={styles.header}>
        <span aria-hidden="true" className={styles.avatar}>
          {initials(reader.data.name)}
        </span>
        <div className={styles.heading}>
          <h2>{reader.data.name}</h2>
          <p className={ui.muted}>
            <Icon name="card" size={16} /> {reader.data.card} · {reader.data.group}
          </p>
        </div>
        <section className={`${styles.fines} ${due > 0 ? styles.owing : ''}`} aria-label="Fines">
          <span className={styles.finesLabel}>Fines due</span>
          <strong className={styles.amount}>{formatReais(due)}</strong>
          {due > 0 && (
            <button type="button" className={ui.button} onClick={() => setConfirming(true)}>
              <Icon name="cash" />
              Pay fines
            </button>
          )}
        </section>
      </header>

      <section className={styles.section} aria-labelledby="out-title">
        <h3 id="out-title" className={styles.sectionTitle}>
          <Icon name="book" />
          On loan
          <span className={styles.count}>{out.length}</span>
        </h3>
        {out.length > 0 ? (
          <LoanTable loans={out} label="On loan" showReader={false} busyId={actions.busyId} onReturn={actions.returnLoan} onRenew={actions.renewLoan} />
        ) : (
          <p className={ui.muted}>No book out right now.</p>
        )}
      </section>

      <div className={styles.columns}>
        <section className={ui.card} aria-labelledby="history-title">
          <h3 id="history-title" className={styles.sectionTitle}>
            <Icon name="calendar" />
            History
          </h3>
          {history.length > 0 ? (
            <ul className={styles.history} aria-label="History">
              {history.map((loan) => (
                <li key={loan.id}>
                  <Link to={`/books/${loan.book.id}`}>{loan.book.title}</Link>
                  <span className={ui.muted}>
                    back on {formatMoment(loan.returnedAt!)}, due {formatDay(loan.dueOn)}
                  </span>
                  {Number(loan.fine) > 0 && (
                    <span className={loan.finePaid ? styles.paid : styles.unpaid}>
                      {formatReais(Number(loan.fine))} {loan.finePaid ? 'paid' : 'due'}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className={ui.muted}>No book returned yet.</p>
          )}
        </section>

        <div className={styles.side}>
          <section className={ui.card} aria-labelledby="waiting-title">
            <h3 id="waiting-title" className={styles.sectionTitle}>
              <Icon name="bookmark" />
              Waiting for
            </h3>
            {reader.data.reservations.length > 0 ? (
              <ul className={styles.plain}>
                {reader.data.reservations.map((reservation) => (
                  <li key={reservation.id}>
                    <Link to={`/books/${reservation.book.id}`}>{reservation.book.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={ui.muted}>No reservation.</p>
            )}
          </section>
          <nav className={ui.card} aria-labelledby="classmates-title">
            <h3 id="classmates-title" className={styles.sectionTitle}>
              <Icon name="users" />
              {reader.data.group === 'Teachers' ? 'Other teachers' : `Also in ${reader.data.group}`}
            </h3>
            <ul className={styles.plain}>
              {reader.data.classmates.map((classmate) => (
                <li key={classmate.id}>
                  <Link to={`/readers/${classmate.id}`}>{classmate.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {confirming && (
        <ConfirmDialog title="Mark the fines as paid" confirmLabel="Mark as paid" confirmIcon="cash" onConfirm={pay} onCancel={() => setConfirming(false)}>
          {reader.data.name} pays {formatReais(due)} at the desk. Every fine of theirs is marked as paid.
        </ConfirmDialog>
      )}
    </article>
  );
}
