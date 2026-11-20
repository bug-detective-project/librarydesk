# LD-205: The overdue list includes books already returned

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Rachel Owens (School librarian) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (loans) |
| Labels | `api`, `loans`, `query` |
| Sprint | LD Sprint 1 |
| Created | Mar 2, 2026 15:30 |

## Description

Every Friday I print the **Overdue** tab and walk the reminders to the homerooms. Last Friday I sent a reminder to Noah for **Hatchet**, and his teacher sent it back with a note: he returned it on Wednesday. So did Ava with **The Outsiders**, weeks ago.

The Overdue tab is mixing the books that are still out with books that came back late. Those rows even say **Returned** in the Status column, and they still have a **Return** button. The red counter next to **Loans** in the menu counts them too.

## Steps to reproduce

1. Open **Loans** and click **Overdue**.
2. Look at the counter next to **Loans** in the menu.

Or, in the VS Code terminal, with the app running:

```sh
curl 'http://localhost:3001/api/loans?status=overdue'
```

## Expected result

Only **Number the Stars** (Liam Carter) and **Of Mice and Men** (David Kim): the copies still out after their due day. The counter says **2**.

## Actual result

Those two, plus every loan that came back (Hatchet, Charlotte's Web, The Outsiders, The Grapes of Wrath, The Giver), marked **Returned**. The counter says more than 2.

## Acceptance criteria

- [ ] The overdue list has only copies that have not come back and whose due day has passed.
- [ ] A copy returned from the Overdue tab leaves the list.
- [ ] The list of all copies out (**On loan**) does not change.

## Environment

- LibraryDesk 1.0
- Any browser; also with curl

## Activity

**Daniel Price** · Mar 2, 2026 15:52
> Overdue should be a part of "On loan". Today the Overdue tab has rows that the On loan tab does not have.
