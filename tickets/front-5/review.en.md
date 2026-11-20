# Code review: LD-105, a key that did not depend on the reader

Data loading has one question to answer: when do I load again? Here the answer forgot the reader. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- React Router renders the same `ReaderPage` for `/readers/1` and `/readers/2`; going from one to the other changes a param, not the component. Its state and effects stay.
- `useResource` reloads when its key changes (the key is the dependency of its effect). The loans' key did not contain the id, so for the hook nothing had changed.
- Reloading the page, or going through the list, mounts a new `ReaderPage`, which is why those paths worked.

## Why the reference fix is right

- The key describes exactly what is loaded, the loans **of this reader**, so a new reader is a new key and a new request.
- `useResource` aborts the request of the old key when the key changes, so a slow answer for Emma cannot land on Liam's page.
- The reader and the loans now follow the same rule.

## Compare with your fix

- Did you add `key={id}` to `<ReaderPage>` in the route? It remounts the page on every reader: it works, and it throws away every state of the page (an open dialog, for one) to hide a missing dependency.
- Did you call `loans.reload()` in an effect on `id`? It works with an extra render, and the old answer can still arrive after the new one.
- Did you read the eslint warning about the dependencies of an effect? It is the same lesson: whatever the load uses must be part of what triggers it.
