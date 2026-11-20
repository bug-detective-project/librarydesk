# Code review: LD-207, a promise nobody waited for

The 404 was already there, thrown by `loadReader`. It just had nowhere to go. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- Express 5 handles errors of async routes for you, but only if it can see them: a route has to be `async` (or return its promise) for a rejection to reach the error handler.
- `findReader(...).then(...)` without `return` and without `.catch` leaves the rejected promise alone. Since Node 15, an unhandled rejection ends the process by default.
- The other routes of the API were written with `async`/`await`, so only this one, and only for a reader that does not exist, could crash.

## Why the reference fix is right

- One line, the same style as every other route: `async`, `await`, `res.json`.
- The error handler in `app.ts` stays the single place that turns errors into answers: the 404 says "There is no such reader", and an error nobody planned for still answers 500 and goes to the log.
- The API stays up for everyone: one bad bookmark no longer stops the desk.

## Compare with your fix

- Did you add a `.catch((error) => res.status(404).json(...))`? The process survives, but every error becomes a 404: a database that is down would answer "There is no such reader".
- Did you add `process.on('unhandledRejection', ...)` in `index.ts`? The process survives and the request never gets an answer: the page stays on "Loading the reader…" forever.
- Did you check for `null` in `findReader`? `loadReader` already throws the `NotFoundError`; the problem was never the missing reader, it was where the error went.
