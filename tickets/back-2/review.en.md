# Code review: LD-202, the oldest loan is not the one that matters

The desk had the right rule and asked the database the wrong question. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- "Is this copy out?" became "take a loan of this copy and see if it came back".
- `order: [['id', 'ASC']]` with `findOne` takes the **first** loan the copy ever had. The variable is even called `last`, which is what the author meant and not what the query does.
- A copy lent for the first time has one loan, so first and last are the same and every quick test passes. The bug only shows once a copy has a history.

## Why the reference fix is right

- `where: { copyId, returnedAt: null }` is the rule itself: a copy is out when one of its loans has not come back.
- It does not depend on the order of the rows, on ids or on dates, so it stays right however the history grows.
- The book page and the count of copies available use the same idea (a copy is out when it has an open loan), so the desk now agrees with what it shows.

## Compare with your fix

- Did you change `'ASC'` to `'DESC'`? It works today: the newest loan is the one that can be open. It is still an indirect question, and it breaks the day two open loans exist for one copy, which is exactly what this bug created in the data.
- Did you use `Loan.count` with `returnedAt: null`? Same rule, same result; fine.
- Did you think about the two computers sending the request at the same second? Both checks can pass before either loan is written. That needs a transaction with a lock, or a unique index on the open loans of a copy; it is a step beyond this ticket, and worth knowing about.
