# Code review: LD-103, the default action of Enter

The handler did its job and then let the browser do its own. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- Implicit submission is a rule of HTML: Enter in a single-line field of a form activates the form's submit button.
- A key handler runs **before** the default action. Unless it calls `preventDefault()`, the default still happens afterwards.
- The arrow branches prevented their default (moving the cursor) and the Enter branch did not, so the field picked the author and the browser sent the form, both from one key press.

## Why the reference fix is right

- `preventDefault()` only in the Enter branch of this field: Enter means "choose" here, and keeps its usual meaning everywhere else in the form.
- The submit button and `onSubmit` are untouched, so the form is still sent by **Add book** and by Enter in the other fields.
- The comment says why, so the next person does not remove it as noise.

## Compare with your fix

- Did you remove the `<form>` or change the button to `type="button"`? Then Enter in the Title field no longer sends the form either, and the browser's form semantics (and screen readers' "form" landmark) are lost.
- Did you call `preventDefault()` in the form's `onKeyDown` for every Enter? Same problem: Enter in the other fields stops working.
- Did you stop the submit in `onSubmit` when the author list is open? It works, with the list's state leaking into the form; the field is the one that knows what Enter means to it.
