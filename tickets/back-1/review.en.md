# Code review: LD-201, a day is not a moment

The rule was simple, "late from the day after the due day", and the code answered a different question: how many 24-hour blocks have passed since midnight in London. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- A due date is a **day** (`DATEONLY` in the table, `'2026-03-09'` in the API). A return is a **moment** (`returnedAt`, a `DATETIME`).
- To compare them, the code turned the day into a moment with `new Date(dueOn)`. A date-only string is read as UTC, so the moment is midnight in UTC, 8 p.m. of the day before in New York.
- `Math.ceil` then turned any fraction of a day into a whole one. The two mistakes together add exactly one day to every fine.

## Why the reference fix is right

- It compares like with like: the day of the return, in the school's time zone, with the due day.
- `libraryDate` uses the time zone database (`America/New_York`), so daylight saving time is handled; no offset is written by hand.
- `daysBetween` works on dates at midnight UTC on both sides, so there is no rounding left to get wrong.
- The fine of an open loan uses the same `lateDays`, so the Loans list and the receipt always agree.

## Compare with your fix

- Did you switch `Math.ceil` to `Math.floor`? The due day is fixed for daytime returns, but a return at 9 p.m. on the due day still counts as late in summer, and the late days are counted from the wrong midnight.
- Did you add `T23:59:59` to the due date? Without a time zone that is read as **local** time, so the result depends on the computer that runs the API; and the district runs it in UTC.
- Did you subtract four hours? New York is five hours behind UTC in winter.
- Did you use `toISOString().slice(0, 10)` for the day of the return? That is the day in UTC: an evening return in New York lands on the next day.
