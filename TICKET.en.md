# LD-101: The count of available copies does not change after a loan

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Daniel Price (Library aide) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Book page |
| Labels | `client`, `state`, `loans` |
| Sprint | LD Sprint 1 |
| Created | Mar 4, 2026 13:25 |

## Description

On the page of a book, under the title, it says how many copies are in: "2 of 3 copies available". When I lend a copy from **Lend a copy**, the list of copies updates right away (the copy shows who has it), the little bars change color, and the toast says "Copy B001-2 lent to…". The number does not: it stays at "2 of 3".

A student at the desk asked for the last copy and I said there was one more, because the page said so. There was not. The number is only right after I reload the page.

## Steps to reproduce

1. Open **To Kill a Mockingbird** from the collection: "2 of 3 copies available".
2. In **Lend a copy**, choose **Ava Thompson** and click **Lend**.

## Expected result

"1 of 3 copies available", as soon as the copy is lent.

## Actual result

"2 of 3 copies available", until the page is reloaded.

## Acceptance criteria

- [ ] The count of copies available follows the copies after every loan, without reloading.
- [ ] Lending the last copy shows "0 of N copies available".
- [ ] The count is right when the page opens.

## Environment

- LibraryDesk 1.0
- Any browser

## Activity

**Rachel Owens** · Mar 4, 2026 13:40
> The bars next to the number are right, I checked. It is only the number.
