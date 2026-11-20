# Solution: The type said number, the API sends text

**Root cause.** The API sends each fine as decimal text (`"0.75"`), the way the `mysql2` driver gives a MySQL `DECIMAL` back. `client/src/api/types.ts` declared `fine: number`, so `finesDue` in `client/src/format.ts` added the fines with `+` and TypeScript did not object. `+` with a string concatenates: one fine still reads as a number, two make `"01.000.75"`, which formats as `$NaN` and is not `> 0`, so the Pay button hides too.

## Step by step

1. **Reproduce it.** Noah Ramirez's page says **$NaN**.
2. **Check the data.** `curl http://localhost:3001/api/readers/4/loans`: `"fine": "1.00"`, a string.
3. **Fix the type** in `client/src/api/types.ts`:

   ```ts
   /** Dollars as decimal text, the way MySQL keeps them: '0.75'. */
   fine: string;
   ```

4. **Convert before adding** in `client/src/format.ts`:

   ```ts
   export function finesDue(loans: { returnedAt: string | null; fine: string; finePaid: boolean }[]): number {
     return loans.filter((loan) => loan.returnedAt && !loan.finePaid).reduce((total, loan) => total + Number(loan.fine), 0);
   }
   ```

The other places already read the fine with `Number(loan.fine)`.

The reference also adds a regression test, `client/src/reader-fines.test.tsx`: two fines sent as text add up to $1.75, and the page shows the total and the Pay button.

Then run `npm test`, open Noah's page, and move the card to **In QA**.
