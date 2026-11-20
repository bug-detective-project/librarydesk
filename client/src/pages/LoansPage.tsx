import { NavLink, useParams } from 'react-router';
import { getLoans } from '../api/loans.ts';
import { Icon } from '../components/Icon.tsx';
import { LoanTable } from '../components/LoanTable.tsx';
import ui from '../components/ui.module.css';
import { useLoanActions } from '../useLoanActions.ts';
import { useResource } from '../useResource.ts';
import styles from './LoansPage.module.css';

export function LoansPage() {
  const status = useParams().status === 'overdue' ? 'overdue' : 'active';
  const { data: loans, error, reload } = useResource(`loans-${status}`, (signal) => getLoans(status, signal));
  const actions = useLoanActions(reload);

  return (
    <section>
      <div className={ui.titleRow}>
        <div>
          <h2>Loans</h2>
          <p className={`${ui.muted} ${styles.lead}`}>The copies that are out, the ones due first at the top.</p>
        </div>
      </div>
      <nav className={styles.tabs} aria-label="Loans">
        <NavLink to="/loans" end>
          <Icon name="book" />
          On loan
        </NavLink>
        <NavLink to="/loans/overdue">
          <Icon name="warning" />
          Overdue
        </NavLink>
      </nav>
      {error && <p className={ui.alert}>{error}</p>}
      {loans && loans.length === 0 && <p className={ui.notice}>{status === 'overdue' ? 'Nothing is overdue. Every copy out is within its time.' : 'No copy is out.'}</p>}
      {loans && loans.length > 0 && (
        <LoanTable loans={loans} label={status === 'overdue' ? 'Overdue loans' : 'Loans'} busyId={actions.busyId} onReturn={actions.returnLoan} onRenew={actions.renewLoan} />
      )}
    </section>
  );
}
