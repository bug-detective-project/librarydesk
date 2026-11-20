# Code review: LD-106, a small component used everywhere

Five statuses, three screens, one component. Here is the reference approach, so you can compare it with yours.

## Why it is built this way

- `Record<Status, string>` ties the labels to the type of the API: a sixth status added to `Status` is a compile error here until it gets a label.
- One class per status, named after the value, keeps the component free of `if`s: `styles[status]` is the whole decision.
- The colors are the tokens of `index.css`, so the badge follows the palette of the app instead of inventing one, and the pairs (strong text on soft background) already pass AA.
- The dot is decoration (`aria-hidden`) and takes `currentColor`: one color per status to maintain, not two.
- `data-status` gives tests and future styles a stable hook that does not depend on the label's wording.

## Compare with your solution

- Did you choose colors by hand (`#e53935`)? They may look right, and they ignore the palette and its contrast.
- Did you write a `switch` with JSX for each case? It works; five copies of the same markup are five places to change the next time.
- Did you show the color only, without words? Color alone fails people who do not see it, and the ticket asks for the label.
- Did you capitalize the raw value (`on_loan` → `On_loan`)? The labels are words a person reads, so they live in the component.
