# Code review: LD-108, finishing the case that mattered

The half that was built was the easy half. Here is the reference approach, so you can compare it with yours.

## Why it was incomplete

- The form was guarded by `book.available > 0`, which hid it exactly when a reservation means something: when every copy is out.
- The request already went to an API that knew both cases, but the client threw the answer away and always said "put aside".
- The page's own text ("Reserve the book to join the queue") promised the missing half.

## Why the reference solution is right

- The form is always there; the API decides what a reservation means for this book, and the client tells the person what happened.
- `ready` and `position` come from the server, so the place is the real one even if someone else reserved a second earlier.
- Reloading the book after reserving shows the queue the server has, rather than a guess added on the client.

## Compare with your solution

- Did you compute the place on the client (`book.reservations.length + 1`)? It is right most of the time, and wrong when two desks reserve at once; the API's `position` is always right.
- Did you keep the `available > 0` condition and add a second form for the queue? It works with two copies of the same form to maintain.
- Did you disable the Reserve button for readers already in the queue? A nice touch; the API also answers 409 in that case, and the toast shows its message.
