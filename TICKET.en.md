# LD-106: Build the status badge of books, copies and loans

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Story |
| Status | To Do |
| Priority | Medium |
| Reporter | Rachel Owens (School librarian) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Components |
| Labels | `client`, `component`, `ui` |
| Sprint | LD Sprint 1 |
| Created | Mar 2, 2026 10:30 |

## Description

Everywhere the desk shows a status, it shows the raw word of the API: `available`, `on_loan`, `overdue`. On the cards of the collection, next to each copy, in the Loans table. It looks unfinished, and at a glance I cannot tell an overdue book from one that is fine: they are the same gray text.

The screens already call a `StatusBadge` component for this (`client/src/components/StatusBadge.tsx`). It is a placeholder that prints the word. Please build it.

## What the badge shows

| Status (from the API) | Label | Color |
| --- | --- | --- |
| `available` | Available | green |
| `on_loan` | On loan | the petrol blue of the app |
| `reserved` | Reserved | amber |
| `overdue` | Overdue | red |
| `returned` | Returned | gray |

- A small pill: the label in words, with a dot of the same color before it.
- Each status has its own colors, from the tokens of `client/src/index.css` (`--ok` and `--ok-soft`, `--brand-strong` and `--brand-soft`, `--amber` and `--amber-soft`, `--danger` and `--danger-soft`, `--muted` and `--sunken`). The text keeps a contrast of at least 4.5:1 against its background.
- The badge carries its status as `data-status` (`data-status="overdue"`), so a style or a test can find it.
- The label is the only text: a screen reader reads "Overdue", nothing else.

## Where it appears

The cards of the collection, the page of a book (the status of the book and of each copy) and the loans tables (Loans, and On loan on the page of a reader). Those screens already pass the status; nothing else changes.

## Acceptance criteria

- [ ] Each status shows its label in words, never the raw value.
- [ ] Each status has a color of its own, readable (AA).
- [ ] The badge has `data-status` with its status.
- [ ] Every screen that shows a status uses the badge.

## Environment

- LibraryDesk 1.0
- Any browser

## Activity

**Daniel Price** · Mar 2, 2026 10:48
> Overdue in red, please. That is the one I look for on a busy morning.
