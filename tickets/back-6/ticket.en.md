# LD-206: Build the endpoint that renews a loan

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Story |
| Status | To Do |
| Priority | High |
| Reporter | Rachel Owens (School librarian) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (loans) |
| Labels | `api`, `loans`, `endpoint` |
| Sprint | LD Sprint 1 |
| Created | Mar 2, 2026 09:00 |

## Description

The **Renew** button is on every loan, in the Loans list and on the page of each reader, and today it only answers "Not found". The screen was finished last sprint; the API never got its part. Students ask to renew every day, and I am writing new due dates on paper.

Please build the endpoint the button calls.

## What is already there

- The client calls `POST /api/loans/:id/renew` (`client/src/api/loans.ts`) and shows, in a toast, either "*title* is renewed until *date*" or the `error` of the answer.
- `server/src/fines.ts` has `LOAN_DAYS` (14) and `MAX_RENEWALS` (2); `server/src/clock.ts` has `today()` and `addDays`.
- `server/src/library.ts` has the other actions of a loan (`lend`, `returnLoan`) and `loanView`, the shape every loan endpoint answers.

## The rules of a renewal

| Case | Answer |
| --- | --- |
| The loan does not exist | **404**, `{"error": "There is no such loan"}` |
| The id is not a whole number | **400** |
| The copy already came back | **409**, `{"error": "This copy is already back"}` |
| The loan is overdue (its due day is before today) | **409**, `{"error": "The loan is overdue: return the copy first"}` |
| The loan was renewed twice already | **409**, `{"error": "A loan is renewed at most 2 times"}` |
| A reader is waiting for the book (an open reservation) | **409**, `{"error": "Another reader is waiting for this book"}` |
| Otherwise | **200**, the loan (as `loanView`), due **14 days from today**, with `renewals` one higher |

A renewal on the due day itself is allowed: the loan is not overdue yet.

## Steps to check

In the sample library, **Emma Johnson** has **To Kill a Mockingbird** (loan 1). In the VS Code terminal, with the app running:

```sh
curl -X POST http://localhost:3001/api/loans/1/renew
```

Or click **Renew** on **To Kill a Mockingbird** in **Loans**.

## Acceptance criteria

- [ ] `POST /api/loans/:id/renew` answers each case of the table.
- [ ] A renewal sets the due day to 14 days from today and adds one to `renewals`.
- [ ] A refused renewal changes nothing.
- [ ] The **Renew** button shows the new due date, and the reason when it is refused.

## Environment

- LibraryDesk 1.0

## Activity

**Daniel Price** · Mar 2, 2026 09:20
> Ethan's **Wonder** was renewed twice already, Liam's **Number the Stars** is overdue and Emma is waiting for **A Wrinkle in Time**. Good cases to try.
