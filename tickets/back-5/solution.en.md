# Solution: Overdue is still out

**Root cause.** `findLoans` in `server/src/library.ts` filters overdue loans with `{ dueOn: { [Op.lt]: today() } }` only. A loan that came back keeps its due day, so every returned loan whose due day passed is listed as overdue.

## Step by step

1. **Reproduce it.** `curl 'http://localhost:3001/api/loans?status=overdue'` lists loans with `"returnedAt"` set.
2. **Compare the two filters** of `findLoans`: `active` has `returnedAt: null`; `overdue` does not.
3. **Make overdue a part of active:**

   ```ts
   const where = status === 'overdue' ? { dueOn: { [Op.lt]: today() }, returnedAt: null } : { returnedAt: null };
   ```

The menu's counter reads the same endpoint, so it is fixed too.

The reference also adds a regression test, `server/src/loans-overdue-out.test.ts`: the overdue list is exactly the two copies still out, and a copy returned leaves it.

Then run `npm test`, open the Overdue tab, and move the card to **In QA**.
