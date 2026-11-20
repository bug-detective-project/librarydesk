# Solution: Cards when the table has no room

**Root cause.** `client/src/components/LoanTable.module.css` styles the table for wide screens only: every cell has `white-space: nowrap`, and nothing changes when the space is narrow. Six columns that cannot wrap need far more than 375px, so the page scrolls sideways.

## Step by step

1. **Reproduce it** at 375px: the page scrolls sideways.
2. **Read the CSS.** `nowrap` on every cell; no rule for narrow widths.
3. **Give the table a container** in `LoanTable.tsx`: `<div className={styles.wrap}><table …>…</table></div>`, and in the CSS:

   ```css
   .wrap {
     container-type: inline-size;
   }
   ```

4. **Let cells wrap**: remove `white-space: nowrap` from `.table td`; keep it only for the due date and the fine:

   ```css
   .table td[data-label='Due'],
   .table td[data-label='Fine'] {
     white-space: nowrap;
   }
   ```

5. **Turn rows into cards** when the table's container is narrow:

   ```css
   @container (max-width: 699px) {
     .table, .table tbody, .table tr, .table td { display: block; }
     .table { border: none; background: none; box-shadow: none; }
     .table thead { display: none; }
     .table tr { margin-bottom: 12px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); }
     .table td { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; border: none; text-align: right; }
     .table td::before { content: attr(data-label); color: var(--muted); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
     .table td:first-child { display: block; text-align: left; }
     .table td:first-child::before, .actions::before { content: none; }
     .table td.actions { justify-content: flex-end; gap: 8px; }
   }
   ```

A container query, not a media query: the same table sits beside the menu and inside a reader page, and what matters is its own width.

The reference also adds a regression test, `client/src/components/LoanTable.layout.test.tsx`: it checks the rules themselves (a narrow-width rule that turns rows into blocks and hides the head, and cells allowed to wrap), since the test environment has no layout.

Then run `npm test`, open Loans at 375px and at 768px, and move the card to **In QA**.
