# LD-108: Finish reserving: it works for a book on the shelf and not for one on loan

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Story |
| Status | To Do |
| Priority | High |
| Reporter | Rachel Owens (School librarian) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Book page |
| Labels | `client`, `form`, `reservations` |
| Sprint | LD Sprint 1 |
| Created | Mar 3, 2026 11:30 |

## Description

The **Reserve** form on the page of a book was left half done. It only appears when a copy is on the shelf, and then it puts that copy aside, which is useful. But the reason we asked for reservations is the opposite case: a student wants a book whose copies are all out, and wants to be next in line.

On **A Wrinkle in Time**, which Sophia has and Emma is waiting for, there is no form at all. The page even says "Every copy is out. Reserve the book to join the queue." and offers no way to do it. The code has a `TODO (LD-108)` where the queue was supposed to go.

The API already does both: it puts a copy aside when one is in, and adds the reader to the queue when not, answering their place.

## What is already there

- `POST /api/books/:id/reservations` with `{ "readerId": … }` answers `{ "id", "position", "ready" }`: `ready` is `true` when a copy was put aside, and `position` is the reader's place in the queue.
- `client/src/components/ReserveForm.tsx` sends the request and shows a toast.
- The **Reservations** card of `client/src/pages/BookPage.tsx` shows the queue.

## What is missing

- The form must be there for **every** book, with or without a copy in.
- When `ready` is `false`, the toast says the place in the queue: **"*reader* is number *position* in the queue for *title*"**, for example "Liam Carter is number 2 in the queue for A Wrinkle in Time".
- When `ready` is `true`, the toast stays as it is: "A copy of *title* is put aside for *reader*".
- After reserving, the queue on the page shows the reader.

## Acceptance criteria

- [ ] A book with every copy out can be reserved from its page.
- [ ] The toast says the reader's place in the queue.
- [ ] The queue shows the new reader at the end.
- [ ] A book with a copy in still puts one aside, with its own message.

## Environment

- LibraryDesk 1.0
- Any browser

## Activity

**Daniel Price** · Mar 3, 2026 11:52
> Fahrenheit 451 is a good one to try too: the only copy is out and nobody is waiting yet, so the first reader is number 1.
