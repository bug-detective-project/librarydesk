# Solution: A renewal, rule by rule

The reference adds `renew` to `server/src/library.ts` and its route to `server/src/routes/loans.ts`.

## Step by step

1. **Write the action**, next to `returnLoan`, checking the rules in the order of the ticket and changing the row only at the end:

   ```ts
   export async function renew(id: unknown) {
     const loan = await loadLoan(idOf(id, 'The loan'));
     if (loan.returnedAt) {
       throw new ConflictError('This copy is already back');
     }
     const day = today();
     if (loan.dueOn < day) {
       throw new ConflictError('The loan is overdue: return the copy first');
     }
     if (loan.renewals >= MAX_RENEWALS) {
       throw new ConflictError(`A loan is renewed at most ${MAX_RENEWALS} times`);
     }
     const waiting = await Reservation.count({ where: { bookId: loan.copy!.bookId, fulfilledAt: null } });
     if (waiting > 0) {
       throw new ConflictError('Another reader is waiting for this book');
     }
     await loan.update({ dueOn: addDays(day, LOAN_DAYS), renewals: loan.renewals + 1 });
     return loanView(await loadLoan(loan.id));
   }
   ```

   `idOf` answers 400 for an id that is not a whole number, `loadLoan` 404 for a loan that does not exist, and the error handler of `app.ts` turns each `ConflictError` into a 409 with its message.

2. **Import what it uses**: `MAX_RENEWALS` from `./fines.ts` (with `LOAN_DAYS`).

3. **Add the route** in `server/src/routes/loans.ts`:

   ```ts
   router.post('/loans/:id/renew', async (req, res) => {
     res.json(await renew(req.params.id));
   });
   ```

The reference also adds a regression test, `server/src/loans-renew.test.ts`: a renewal of 14 days counted, the limit of two, an overdue loan, a book someone waits for, a copy that came back, and the 404 and 400.

Then run `npm test`, click **Renew** on **To Kill a Mockingbird**, and move the card to **In QA**.
