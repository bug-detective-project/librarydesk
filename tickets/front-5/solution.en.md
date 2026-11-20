# Solution: The key says which reader the loans are of

**Root cause.** `ReaderPage` loads the reader with the key `` `reader-${id}` `` and the loans with the key `'reader-loans'`. React Router keeps the same component when only the `:id` of the address changes, and `useResource` reloads only when its key changes, so the reader is reloaded and the loans are not.

## Step by step

1. **Reproduce it.** Emma Johnson, then **Liam Carter** in Also in Grade 7: the name changes, the table does not.
2. **Watch the requests**, like Marcus: `/api/readers/2` is asked, `/api/readers/2/loans` is not.
3. **Read the two `useResource` calls** in `ReaderPage`: one key has the id, the other does not.
4. **Put the id in the key:**

   ```tsx
   const loans = useResource(`reader-loans-${id}`, (signal) => getReaderLoans(id, signal));
   ```

The reference also adds a regression test, `client/src/reader-switch.test.tsx`: going to a classmate and back shows the loans of the reader on the page.

Then run `npm test`, try the steps again, and move the card to **In QA**.
