# Solution: Look for the loan that is still open

**Root cause.** `lend` in `server/src/library.ts` decides whether a copy is out from **one** loan of it, the first one ever made (`order: [['id', 'ASC']]`). Once a copy has been lent and returned, that first loan is always "returned", so the copy is never refused again, whoever has it.

## Step by step

1. **Reproduce it** with the three `curl` of the ticket: the third answers 201.
2. **Compare with a fresh copy.** For a copy lent for the first time, the oldest loan is the open one, so the check works. That is why Rachel's test passed.
3. **Read the check** in `lend`: `findOne` with `order: [['id', 'ASC']]` returns the oldest row.
4. **Ask for an open loan of the copy:**

   ```ts
   if (await Loan.findOne({ where: { copyId: copy.id, returnedAt: null } })) {
     throw new ConflictError(`Copy ${copy.code} is already on loan`);
   }
   ```

The reference also adds a regression test, `server/src/loans-one-reader-per-copy.test.ts`: a copy that came back and went out again is refused to a third reader, and a copy that never came back is refused too.

Then run `npm test`, repeat the `curl` of the ticket (after `npm run db:reset`), and move the card to **In QA**.
