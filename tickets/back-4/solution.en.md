# Solution: Take the dashes out before checking

**Root cause.** `parseIsbn` in `server/src/isbn.ts` validates the text as typed and normalizes it afterwards. `isValidIsbn` wants exactly 13 digits, so any dash or space fails it, and the normalization that would have removed them never runs.

## Step by step

1. **Reproduce it** with the `curl` of the ticket, then with the bare digits: only the second passes.
2. **Follow the ISBN.** `createBook` calls `parseIsbn(input.isbn)` and refuses the field when it gets `null`.
3. **Read `parseIsbn`.** The order is validate, then normalize.
4. **Swap the order:**

   ```ts
   /** The digits of a valid ISBN, or null when the text is not one. */
   export function parseIsbn(typed: string): string | null {
     const digits = normalizeIsbn(typed);
     return isValidIsbn(digits) ? digits : null;
   }
   ```

The reference also adds a regression test, `server/src/isbn-dashes.test.ts`: ISBNs with dashes in two groupings and with spaces read as 13 digits, a wrong check digit still refused, and the API adding a book typed with dashes.

Then run `npm test`, add **Little Women** from the form, and move the card to **In QA**.
