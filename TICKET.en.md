# LD-201: A book returned on its due day is charged as late

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Rachel Owens (School librarian) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (fines) |
| Labels | `api`, `fines`, `dates` |
| Sprint | LD Sprint 1 |
| Created | Mar 5, 2026 08:20 |

## Description

Yesterday a parent wrote to the school: her daughter brought **Holes** back on its due day, before lunch, and the desk charged her **$0.25**. The receipt on the screen said "Copy B006-1 is back, $0.25 in fines". I checked the card: due that same day. She was on time.

It is not only that one. Every book that comes back on its due day gets one day of fine, and the books that really are late get one day too many: **Number the Stars**, due six days ago, shows **$1.75** in the Loans list. Six days at 25 cents is $1.50.

We tell the students they have until the end of the due day. The desk has to agree with us.

## Steps to reproduce

In the sample library, **Olivia Bennett** has **Holes**, due today.

1. Open **Loans**.
2. Look at the **Fine** column of **Number the Stars** (Liam Carter).
3. Click **Return** on **Holes**.

Or, in the VS Code terminal, with the app running:

```sh
curl 'http://localhost:3001/api/loans?status=active'
```

## Expected result

- Returning **Holes** says "Copy B006-1 is back on the shelf", and the loan has a fine of `"0.00"`.
- **Number the Stars** owes **$1.50** so far: six days late.

## Actual result

- "Copy B006-1 is back, $0.25 in fines", and the loan has a fine of `"0.25"`.
- **Number the Stars** shows **$1.75**.

## Acceptance criteria

- [ ] A copy returned on its due day, at any hour, pays nothing.
- [ ] A copy returned after its due day pays 25 cents for each day after it: two days late is `"0.50"`.
- [ ] The fine an overdue copy owes so far counts the same whole days.
- [ ] The days are counted in the school's time zone (New York), whatever the time zone of the computer that runs the API.

## Environment

- LibraryDesk 1.0
- Any browser; also with curl

## Activity

**Marcus Lee** · Mar 5, 2026 09:02
> The fines are worked out by the API when a copy comes back. For what it is worth: the district's servers run in UTC, and the school is in New York.
