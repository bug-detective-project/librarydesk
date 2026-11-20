import { useState } from 'react';
import { renewLoan, returnLoan } from './api/loans.ts';
import type { Loan } from './api/types.ts';
import { formatDay, formatDollars } from './format.ts';
import { useToast } from './useToast.ts';

/** Return and Renew, with their toasts; `done` reloads what the screen shows. */
export function useLoanActions(done: () => void) {
  const toast = useToast();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function run(loan: Loan, action: (id: number) => Promise<Loan>, message: (changed: Loan) => string) {
    setBusyId(loan.id);
    try {
      const changed = await action(loan.id);
      toast.success(message(changed));
      done();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setBusyId(null);
    }
  }

  return {
    busyId,
    returnLoan: (loan: Loan) =>
      run(loan, returnLoan, (changed) =>
        Number(changed.fine) > 0 ? `Copy ${changed.copy.code} is back, ${formatDollars(Number(changed.fine))} in fines` : `Copy ${changed.copy.code} is back on the shelf`,
      ),
    renewLoan: (loan: Loan) => run(loan, renewLoan, (changed) => `${changed.book.title} is renewed until ${formatDay(changed.dueOn)}`),
  };
}
