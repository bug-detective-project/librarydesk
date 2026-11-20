# Code review: LD-101, state that should have been a calculation

The page had the right copies; one number was a copy of an old answer. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- `useState(initial)` uses `initial` once, when the component first appears. It is meant for values the component changes itself, not for values that follow props.
- After a loan, the book page reloads the book and passes the new copies down. `Availability` is the same component on the screen, so it keeps its state.
- The bars were computed from the prop, which is why they were right and made the bug look strange.

## Why the reference fix is right

- The number is derived from `copies` during render, like the bars: one source of truth, always in step.
- Filtering a few copies on each render costs nothing; there is nothing to cache.
- The component has no state left, which is one less thing to keep in sync.

## Compare with your fix

- Did you add a `useEffect` that calls `setAvailable` when `copies` changes? It works, with an extra render that first paints the old number and then the new one; React's docs call this "you might not need an effect".
- Did you add a `key` to `<Availability>` that changes with the copies? It forces a new component and so a new state; it hides the problem instead of removing it.
- Did you read `book.available` from the API instead? Also right: the API already sends it. Either way the number must come from the data of this render.
