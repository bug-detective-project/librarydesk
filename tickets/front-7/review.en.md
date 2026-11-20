# Code review: LD-107, a table that only knew one width

A table of six columns cannot fit a phone; the design had planned cards and the CSS never built them. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- `white-space: nowrap` on every cell made each column as wide as its longest text.
- Nothing changed for narrow spaces, so the table set the width of the page and the page scrolled sideways.
- The markup had `data-label` on every cell for the cards, so the missing part was CSS only.

## Why the reference fix is right

- A **container** query measures the space the table is given, so it turns into cards beside the menu of a tablet, inside a reader page and on a phone, with one rule.
- The same markup serves both layouts: `td::before` shows `data-label`, so a card reads "DUE Mar 13, 2026" without new elements.
- Only the values that must not break (a date, an amount) keep `nowrap`.
- On a wide screen nothing changes: the table keeps its columns.

## Compare with your fix

- Did you put the table in a box with `overflow-x: auto`? The page stops scrolling, the table scrolls instead, and the buttons are still out of sight on a phone. The ticket asks for the buttons on the screen.
- Did you use `@media (max-width: 767px)`? The phone is fixed; the reader page and the tablet beside the menu, where the table has less room than the window, still overflow.
- Did you hide columns on small screens? Then the reader or the due date can no longer be read, and the acceptance criteria ask for both.
