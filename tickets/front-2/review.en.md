# Code review: LD-102, a type that lied

TypeScript can only check the code against what the types say, and the type of `fine` described the wish, not the wire. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- MySQL keeps money as `DECIMAL(8,2)`. The `mysql2` driver returns a `DECIMAL` as a string, on purpose: a JavaScript number cannot hold every decimal exactly. The API passes it on as is.
- The client's `Loan` type said `number`. Nothing checks the JSON of a `fetch` against a type, so the lie was never caught.
- With the wrong type, `total + loan.fine` was accepted, and `+` with a string concatenates. One fine hid the problem, because `Number("00.75")` is still 0.75.

## Why the reference fix is right

- The type now says what the API sends, so the compiler is useful again: any new `+ loan.fine` is a type error.
- `Number()` happens in one place, where the amounts are added.
- The API keeps sending text, so no cent is rounded on the way.

## Compare with your fix

- Did you change only `finesDue` and leave `fine: number`? The page works, and the next person who adds fines falls in the same trap.
- Did you convert in the API (`Number(loan.fine)` in `loanView`)? It works too, with a decision to make: money as a float across the wire. For cents it is usually fine; it is a choice, not a fix of the client.
- Did you use `parseFloat`? Same result for these strings; `Number` refuses partial numbers like `"1.00abc"` instead of reading `1`.
