# Solução: Uma etiqueta para cinco situações

A referência troca o provisório de `client/src/components/StatusBadge.tsx` e acrescenta o `StatusBadge.module.css`.

## Passo a passo

1. **O componente**: um texto por situação, as duas classes, o `data-status`, um ponto e o texto.

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

2. **Os estilos**, com os tokens do app:

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

A referência também adiciona um teste de regressão, `client/src/components/StatusBadge.test.tsx`: cada situação por extenso, o `data-status` dela e um estilo próprio para cada uma.

Depois rode `npm test`, olhe o acervo e a tela de empréstimos e mova o cartão para **In QA**.
