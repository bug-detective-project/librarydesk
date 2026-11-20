# Solution: Enter answers the list, not the form

**Root cause.** In a form with a submit button, Enter in a text field submits the form (implicit submission). `keyDown` in `client/src/components/AuthorField.tsx` handles Enter to pick an author but never calls `event.preventDefault()`, so the browser also submits the form.

## Step by step

1. **Reproduce it.** Type `Stein`, ↓, Enter: messages appear under the empty fields.
2. **Read `keyDown`.** The arrows call `preventDefault`; Enter does not.
3. **Stop the default action of Enter** in this field:

   ```tsx
   } else if (event.key === 'Enter') {
     // Enter answers the list, not the form: the book is saved only by its button.
     event.preventDefault();
     const chosen = shown[active] ?? shown.find((author) => author.name.toLowerCase() === text.trim().toLowerCase());
     // …
   ```

The reference also adds a regression test, `client/src/author-enter.test.tsx`: Enter picks the highlighted author, or keeps a new name, and no request to add a book is made.

Then run `npm test`, try the steps again, and move the card to **In QA**.
