# LD-204: An ISBN with dashes is refused

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Daniel Price (Library aide) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (books) |
| Labels | `api`, `validation`, `isbn` |
| Sprint | LD Sprint 1 |
| Created | Mar 6, 2026 11:15 |

## Description

The PTA donated a box of books and I spent the afternoon adding them. I could not add a single one.

I fill in the **New book** form, type the ISBN from the back of the book, and the form answers "Type the 13 digits of the ISBN, with or without dashes" under the ISBN. The form itself puts the dashes in while I type (978-0-0000-0000-0), so every ISBN I type has dashes. The message says dashes are fine.

Marcus added one for me with `curl`, typing only the digits, and that one went in. So the ISBNs are right; it is the dashes.

## Steps to reproduce

Open **New book** and add **Little Women**, by Louisa May Alcott, 1868, ISBN `9780306406157` (the form shows `978-0-3064-0615-7`). Or, in the VS Code terminal, with the app running:

```sh
curl -X POST http://localhost:3001/api/books -H 'Content-Type: application/json' \
  -d '{"title": "Little Women", "authorName": "Louisa May Alcott", "isbn": "978-0-306-40615-7", "year": 1868, "copies": 1}'
```

## Expected result

**201**: the book is added, and its ISBN is kept as 13 digits and shown as `978-0-3064-0615-7`.

## Actual result

**400**, `{"fields": {"isbn": "Type the 13 digits of the ISBN, with or without dashes"}}`.

## Acceptance criteria

- [ ] An ISBN typed with dashes, or with spaces, between its groups is accepted.
- [ ] An ISBN whose check digit is wrong is still refused, with the same message.
- [ ] The book keeps the 13 digits, whatever was typed.

## Environment

- LibraryDesk 1.0
- Any browser; also with curl

## Activity

**Marcus Lee** · Mar 6, 2026 11:40
> `9780306406157` goes in, `978-0-306-40615-7` does not. Same book, same number.
