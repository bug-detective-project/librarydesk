# Solution: Reserve every book, and say the place in the queue

**What was missing.** `BookPage` showed the form only when a copy was in (`book.available > 0`), and `ReserveForm` ignored the API's answer and always said "put aside". The API already answered `ready` and `position`.

## Step by step

1. **Reproduce it.** **A Wrinkle in Time** has no Reserve form.
2. **Show the form for every book** in `client/src/pages/BookPage.tsx`:

   ```tsx
   <ReserveForm book={book} readers={readers ?? []} onReserved={reload} />
   ```

3. **Use the answer** in `client/src/components/ReserveForm.tsx`, replacing the `TODO`:

   ```tsx
   const result = await reserveBook(book.id, reader.id);
   if (result.ready) {
     toast.success(`A copy of ${book.title} is put aside for ${reader.name}`);
   } else {
     toast.success(`${reader.name} is number ${result.position} in the queue for ${book.title}`);
   }
   ```

`onReserved` reloads the book, so the queue on the page shows the new reader.

The reference also adds a regression test, `client/src/reserve-queue.test.tsx`: reserving a book with every copy out says the place and shows the reader in the queue, and a book with a copy in still puts one aside.

Then run `npm test`, reserve **A Wrinkle in Time** for Liam Carter, and move the card to **In QA**.
