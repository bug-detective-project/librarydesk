# Solution: A badge for five statuses

The reference replaces the placeholder in `client/src/components/StatusBadge.tsx` and adds `StatusBadge.module.css`.

## Step by step

1. **The component**: a label per status, both classes, `data-status`, a dot and the label.

   ```tsx
   import type { Status } from '../api/types.ts';
   import styles from './StatusBadge.module.css';

   const LABELS: Record<Status, string> = {
     available: 'Available',
     on_loan: 'On loan',
     reserved: 'Reserved',
     overdue: 'Overdue',
     returned: 'Returned',
   };

   /** The status of a book, a copy or a loan, in words and in a color of its own. */
   export function StatusBadge({ status }: { status: Status }) {
     return (
       <span className={`${styles.badge} ${styles[status]}`} data-status={status}>
         <span aria-hidden="true" className={styles.dot} />
         {LABELS[status]}
       </span>
     );
   }
   ```

2. **The styles**, with the tokens of the app:

   ```css
   .badge {
     display: inline-flex;
     align-items: center;
     gap: 6px;
     padding: 3px 10px;
     border-radius: 999px;
     font-size: 0.8125rem;
     font-weight: 700;
     white-space: nowrap;
   }

   .dot {
     width: 7px;
     height: 7px;
     border-radius: 999px;
     background: currentColor;
   }

   .available { background: var(--ok-soft); color: var(--ok); }
   .on_loan { background: var(--brand-soft); color: var(--brand-strong); }
   .reserved { background: var(--amber-soft); color: var(--amber); }
   .overdue { background: var(--danger-soft); color: var(--danger); }
   .returned { background: var(--sunken); color: var(--muted); }
   ```

The reference also adds a regression test, `client/src/components/StatusBadge.test.tsx`: each status in words, its `data-status`, and a style of its own for each.

Then run `npm test`, look at the collection and the Loans page, and move the card to **In QA**.
