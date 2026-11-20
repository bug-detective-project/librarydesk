# Code review: LD-203, the other half of "Title or author"

The search box promised two fields and the query compared one. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- The author is not a column of `books`; it lives in `authors`, and the query reaches it through the `include` that already brings it for the cards.
- The `where` was written for the title only. A book whose title happens to contain the author's name ("Reading Steinbeck") made the search look half right.

## Why the reference fix is right

- `'$author.name$'` lets the main `where` compare a column of the joined table, so the database does the whole search in one statement.
- `Op.or` keeps the title search as it was: either match is enough.
- A book has exactly one author, so the join cannot list a book twice.
- `likeText` was already escaping `%` and `_`; the new condition uses it too.

## Compare with your fix

- Did you put the condition in the `include` (`include: [{ model: Author, where: … }]`)? That makes the include required: only books whose **author** matches survive, and the title search is gone.
- Did you load every book and filter in JavaScript? It works for 15 books; the database exists to do this for 15,000.
- Did you add `LOWER(...)` on both sides? Not needed with MySQL's default collation, and it stops the database from using an index on the column.
