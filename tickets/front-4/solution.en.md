# Solution: Sort titles the way a library files them

**Root cause.** `sortBooks` in `client/src/collection.ts` sorts by title with `collator.compare(a.title, b.title)`, the titles as written. The filing rule, `filingTitle`, is right there in the same file and used everywhere else, but not in the title order.

## Step by step

1. **Reproduce it.** The collection opens with **A Wrinkle in Time** first.
2. **Find the order.** `sortBooks(books, 'title')`.
3. **Compare filing titles:**

   ```ts
   if (by === 'title') {
     sorted.sort((a, b) => collator.compare(filingTitle(a.title), filingTitle(b.title)));
   }
   ```

The reference also adds a regression test, `client/src/collection-filing.test.tsx`: titles with "The", "A" and "An" filed under their next word, "Theo" and "Anatomy" left as they are, and the collection opening in that order.

Then run `npm test`, open the collection, and move the card to **In QA**.
