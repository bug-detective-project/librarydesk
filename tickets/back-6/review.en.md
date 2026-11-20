# Code review: LD-206, a small endpoint with four rules

The route is two lines; the work is in the rules and in their order. Here is the reference approach, so you can compare it with yours.

## Why it is built this way

- The action lives in `library.ts` with the other rules of the desk, and the route only reads the request and calls it. A renewal could come from another screen tomorrow, and the rules come with it.
- Every refusal is checked before anything is written: a refused renewal leaves the loan exactly as it was.
- The order follows the table: a copy that came back has no "overdue" or "renewals" to talk about, and the cheap checks run before the query on reservations.
- The new due day counts from **today**, not from the old due day. That is the library's rule, and it is why a renewal on the due day gives exactly 14 more days.
- The answer is `loanView`, the same shape as the other loan endpoints, so the client's toast finds `book.title` and `dueOn` where it expects them.

## Compare with your solution

- Did you add `LOAN_DAYS` to the old `dueOn`? Renewing early would then give more than two weeks from today, and the ticket says 14 days from today.
- Did you write the 409s with `res.status(409).json(...)` in the route? It works, but the rules are then split between the route and `library.ts`, and the error handler already does that for every `ConflictError`.
- Did you compare dates with `new Date(...)`? `dueOn` and `today()` are both `YYYY-MM-DD`, and such texts sort like the dates they are; turning them into moments brings back the time-zone problems of LD-201.
- Did you count the reservations of the **copy**? Reservations are of a book: anyone waiting for **any** copy blocks the renewal.
