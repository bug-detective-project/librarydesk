# LD-107: The loans table overflows the screen

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Daniel Price (Library aide) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Loans |
| Labels | `client`, `css`, `responsive` |
| Sprint | LD Sprint 1 |
| Created | Mar 4, 2026 16:20 |

## Description

I check returns from my phone when I walk the shelves, and the Loans page does not fit it: the table is wider than the screen, the page scrolls sideways, and the **Return** and **Renew** buttons are off to the right. I scroll left and right for every row.

It also happens on the tablet at the desk, where the menu takes the left side, and on the page of a reader, where the table is narrower.

## Steps to reproduce

1. Open **Loans** in a window 375px wide (in the browser's device toolbar, an iPhone SE or similar).
2. Try to reach the **Return** button of a loan.

## Expected result

Without room for the six columns, each loan is a card: the book and its copy on top, then Reader, Due, Status and Fine, each beside its label, and the buttons at the bottom. Nothing scrolls sideways, at 375px and at 768px.

## Actual result

The table keeps its six columns, its cells never wrap, and the page scrolls sideways; the buttons are outside the screen.

## Acceptance criteria

- [ ] At 375px and at 768px the Loans page does not scroll sideways.
- [ ] Every Return and Renew button is on the screen.
- [ ] The book, the reader and the due date of each loan can be read.
- [ ] On a wide screen the table keeps its columns.

## Environment

- LibraryDesk 1.0
- Any browser; phones from 375px wide

## Activity

**Rachel Owens** · Mar 4, 2026 16:35
> The cells already know their labels (`data-label="Due"` and so on), I remember that from when it was built. The cards were planned.
