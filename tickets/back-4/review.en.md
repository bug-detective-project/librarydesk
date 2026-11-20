# Code review: LD-204, clean first, then check

Two correct functions, called in the wrong order. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- `normalizeIsbn` turns what people type into the canonical form; `isValidIsbn` checks the canonical form.
- `parseIsbn` checked first. The canonical check saw dashes and said no, and the canonical form was only built for values that were already canonical.
- Typing bare digits hides the problem, which is why the `curl` worked and the form, which always adds dashes, never did.

## Why the reference fix is right

- Input is normalized once, at the edge, and everything after it works on the canonical form: the check digit, the uniqueness check and what is stored.
- `isValidIsbn` keeps its strict `/^\d{13}$/`: after normalizing, anything that is not 13 digits really is wrong.
- A wrong check digit is still refused with the same message, so the form behaves exactly as before for bad numbers.

## Compare with your fix

- Did you loosen the regex in `isValidIsbn` to accept dashes? Then the check digit is computed over a string with dashes in it, and the stored ISBN keeps them: the uniqueness check would see `9780306406157` and `978-0-306-40615-7` as two books.
- Did you strip the dashes in `createBook` before calling `parseIsbn`? It works, but the next caller of `parseIsbn` has the same trap; the function itself should accept what people type.
- Did you also strip other characters (dots, letters)? The message promises dashes and spaces; anything else should still be refused.
