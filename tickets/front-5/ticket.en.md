# LD-105: The reader page shows the loans of the reader before

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Rachel Owens (School librarian) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Reader page |
| Labels | `client`, `routing`, `loading` |
| Sprint | LD Sprint 1 |
| Created | Mar 5, 2026 12:15 |

## Description

At the end of the day I go through a class: I open one student and use **Also in Grade 7**, on the right, to go to the next. The name at the top changes, the card number changes, and the **On loan** table keeps showing the books of the **first** student. I almost charged Liam for Emma's book.

If I reload the page, the table is right. If I go back to **Readers** and click the student there, it is right too. It only happens when I go from one reader straight to another.

## Steps to reproduce

1. Open **Readers** and then **Emma Johnson**: On loan has **To Kill a Mockingbird**.
2. In **Also in Grade 7**, click **Liam Carter**.

## Expected result

Liam Carter's page, with **Number the Stars** in On loan.

## Actual result

Liam Carter's name, and **To Kill a Mockingbird** (Emma's book) in On loan. The history is Emma's too.

## Acceptance criteria

- [ ] Going from one reader to another shows the loans and the history of the reader on the page.
- [ ] A classmate with no book out shows "No book out right now.", not the books of the reader before.
- [ ] Opening a reader from the list, or reloading, still works.

## Environment

- LibraryDesk 1.0
- Any browser

## Activity

**Marcus Lee** · Mar 5, 2026 12:40
> In the network tab of the browser, going from Emma to Liam asks for `/api/readers/2` but never for `/api/readers/2/loans`.
