# Code review: LD-205, a filter that forgot what it filters

Overdue is a stronger condition than on loan, and the code wrote it as a different one. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- The two filters were written side by side, and the overdue one kept only the condition that makes it special (the date) and lost the one it shares with on loan (not returned).
- A returned loan keeps its due day for the history, so the date alone matches every loan that ever came back after its time, and most that came back on time too.

## Why the reference fix is right

- Overdue = on loan AND due day passed. The code now says exactly that.
- The database does the filtering, so the counter in the menu, which reads the same endpoint, agrees with the tab.
- Nothing changes for `active`.

## Compare with your fix

- Did you filter `status === 'overdue'` in the client? The tab looks right, but the API and the counter still answer the wrong list, and the next screen that reads the endpoint inherits the problem.
- Did you check `returnedAt` in `loanView` and drop the returned ones there? That loads the whole history to throw most of it away.
- Did you write `{ [Op.and]: [...] }`? It is the same AND, written longer; fine.
