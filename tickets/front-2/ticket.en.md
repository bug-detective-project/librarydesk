# LD-102: A fine shows as "$NaN"

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
| Labels | `client`, `fines`, `types` |
| Sprint | LD Sprint 1 |
| Created | Mar 5, 2026 15:10 |

## Description

Noah came to pay his fines and his page said **Fines due: $NaN**. There was no **Pay fines** button either, so I could not mark them as paid.

His history is right: **Charlotte's Web**, $1.00 due, and **Hatchet**, $0.75 due. It is only the total. Ava's page, who paid her one fine, says $0.00, which is right. A student with a single late book shows the right amount too; it seems to break when there are two or more.

## Steps to reproduce

1. Open **Readers** and then **Noah Ramirez**.
2. Look at **Fines due**, at the top right.

## Expected result

**Fines due: $1.75**, and the **Pay fines** button.

## Actual result

**Fines due: $NaN**, and no **Pay fines** button.

## Acceptance criteria

- [ ] The fines due are the sum of the unpaid fines of the books that came back late, in dollars.
- [ ] A reader with two or more fines sees the right total and can pay them.
- [ ] Paid fines are left out, and a reader with none sees $0.00.

## Environment

- LibraryDesk 1.0
- Any browser

## Activity

**Marcus Lee** · Mar 5, 2026 15:34
> The API looks fine to me: `/api/readers/4/loans` has `"fine": "1.00"` and `"fine": "0.75"`. The database keeps money as `DECIMAL`, and the MySQL driver hands a `DECIMAL` back as a string so no cent is ever lost in a float.
