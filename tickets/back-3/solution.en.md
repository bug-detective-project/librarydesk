# Solution: Search the author's name too

**Root cause.** `findBooks` in `server/src/library.ts` builds `where: { title: { [Op.like]: '%steinbeck%' } }`. The author's name is never compared, so only books with the name in their title are found.

## Step by step

1. **Reproduce it.** `curl 'http://localhost:3001/api/books?q=lowry'` answers `[]`.
2. **Read the query.** The `where` of `findBooks` has a single condition, on `title`.
3. **Find where the author comes from.** `bookIncludes` joins `Author` as `author`, so its columns are reachable from the main `where` as `'$author.name$'`.
4. **Compare the text with either:**

   ```ts
   const where = text
     ? { [Op.or]: [{ title: { [Op.like]: likeText(text) } }, { '$author.name$': { [Op.like]: likeText(text) } }] }
     : {};
   ```

   `likeText` keeps a `%` or `_` typed in the box literal. MySQL's default collation is case-insensitive, so `LOWRY` and `lowry` give the same answer.

The reference also adds a regression test, `server/src/books-search-author.test.ts`: the books of Steinbeck, Lowry and Harper Lee found by a piece of the author's name, and a title still found.

Then run `npm test`, search `Steinbeck` in the collection, and move the card to **In QA**.
