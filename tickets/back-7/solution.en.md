# Solution: Let Express see the rejection

**Root cause.** The route `GET /readers/:id` in `server/src/routes/readers.ts` starts `findReader(...)` and attaches only a `.then`. When the reader does not exist, `findReader` rejects with a `NotFoundError`; the route did not return that promise and is not `async`, so Express never sees it. Node treats an unhandled rejection as a fatal error and ends the process.

## Step by step

1. **Reproduce it.** `curl -i http://localhost:3001/api/readers/99999` never answers, and the terminal of the API shows the error and stops.
2. **Compare with a book.** `/api/books/99999` throws the same kind of error and answers 404: its route is `async` and `await`s the call.
3. **Write the route the same way:**

   ```ts
   router.get('/readers/:id', async (req, res) => {
     res.json(await findReader(req.params.id));
   });
   ```

Express 5 passes what an async route throws to the error handler in `app.ts`, which answers a `NotFoundError` with 404 and its message.

The reference also adds a regression test, `server/src/readers-unknown.test.ts`: an unknown reader answers 404 in JSON, and the API still answers a known reader and a bad id afterwards.

Then run `npm test`, repeat the two `curl`, and move the card to **In QA**.
