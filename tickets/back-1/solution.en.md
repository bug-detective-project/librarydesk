# Solution: Late is counted in days, at the school

**Root cause.** `lateDays` in `server/src/fines.ts` subtracts `new Date(dueOn)` from the moment of the return and rounds up. `new Date('2026-03-09')` is midnight UTC, which is the evening before in New York, so every return on the due day is a few hours "late", and `Math.ceil` makes that a day. The same extra day lands on every overdue fine.

## Step by step

1. **Reproduce it.** Return **Holes** on the Loans page: "$0.25 in fines".
2. **Find where the fine is made.** `returnLoan` calls `fineFor(loan.dueOn, returnedAt)`, which calls `lateDays`.
3. **See the comparison.** A day (`dueOn`) is compared with a moment (`returnedAt`), through `new Date(dueOn)`, which is a moment in UTC.
4. **Count days in the school's calendar**, with what `server/src/clock.ts` already offers:

   ```ts
   import { daysBetween, libraryDate } from './clock.ts';

   /** How many days late a book came back: 0 when it came back on or before its due day. */
   export function lateDays(dueOn: string, returnedAt: Date): number {
     return Math.max(0, daysBetween(dueOn, libraryDate(returnedAt)));
   }
   ```

   `libraryDate` gives the day of the return in New York (daylight saving time included), and `daysBetween` counts whole days between two days. The fine of an overdue copy uses the same function, so it is fixed too.

The reference also adds a regression test, `server/src/fines-due-day.test.ts`: a return on the due day at any hour pays nothing, whole days after it are counted, and the API charges nothing for **Holes** and $0.50 for a copy two days late.

Then run `npm test`, return **Holes** again (`npm run db:reset` brings it back), and move the card to **In QA**.
