# Solução: Atraso se conta em dias, no calendário da escola

**Causa raiz.** O `lateDays` em `server/src/fines.ts` subtrai `new Date(dueOn)` do momento da devolução e arredonda para cima. `new Date('2026-03-09')` é a meia-noite em UTC, que em Nova York é a noite anterior, então toda devolução no último dia fica algumas horas "atrasada", e o `Math.ceil` transforma isso em um dia. O mesmo dia a mais cai em toda multa de atraso.

## Passo a passo

1. **Reproduza.** Devolva **Holes** na tela de empréstimos: "$0.25 in fines".
2. **Ache onde a multa nasce.** O `returnLoan` chama `fineFor(loan.dueOn, returnedAt)`, que chama `lateDays`.
3. **Veja a comparação.** Um dia (`dueOn`) é comparado com um momento (`returnedAt`), através de `new Date(dueOn)`, que é um momento em UTC.
4. **Conte dias no calendário da escola**, com o que o `server/src/clock.ts` já oferece:

   ```ts
   import { daysBetween, libraryDate } from './clock.ts';

   /** How many days late a book came back: 0 when it came back on or before its due day. */
   export function lateDays(dueOn: string, returnedAt: Date): number {
     return Math.max(0, daysBetween(dueOn, libraryDate(returnedAt)));
   }
   ```

   O `libraryDate` dá o dia da devolução em Nova York (com horário de verão), e o `daysBetween` conta dias inteiros entre dois dias. A multa de um exemplar atrasado usa a mesma função, então também fica certa.

A referência também adiciona um teste de regressão, `server/src/fines-due-day.test.ts`: uma devolução no último dia, a qualquer hora, não paga nada; dias inteiros depois dele são contados; e a API não cobra nada por **Holes** e cobra $0.50 de um exemplar dois dias atrasado.

Depois rode `npm test`, devolva **Holes** de novo (o `npm run db:reset` traz o empréstimo de volta) e mova o cartão para **In QA**.
