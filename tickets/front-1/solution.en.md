# Solution: Count the copies on every render

**Root cause.** `Availability` in `client/src/components/Availability.tsx` keeps the number of copies available in state, initialized from the copies of the first render. When the book page reloads the book after a loan, the component gets the new copies as a prop, but `useState` ignores its initializer after the first render, so the number never changes.

## Step by step

1. **Reproduce it.** Lend a copy of **To Kill a Mockingbird**: the list and the bars change, the number does not.
2. **Find the number.** It is `available` in `Availability`, and it comes from `useState`.
3. **Derive it instead:**

   ```tsx
   export function Availability({ copies }: { copies: Copy[] }) {
     const available = copies.filter((copy) => copy.status === 'available').length;
     // …
   ```

   Remove the `useState` import.

The reference also adds a regression test, `client/src/book-availability.test.tsx`: lending a copy takes one off the count, and lending the last one shows none.

Then run `npm test`, lend a copy again, and move the card to **In QA**.
