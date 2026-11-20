# Solução: O tipo dizia número, a API manda texto

**Causa raiz.** A API manda cada multa como texto decimal (`"0.75"`), do jeito que o driver `mysql2` devolve um `DECIMAL` do MySQL. O `client/src/api/types.ts` declarava `fine: number`, então o `finesDue` em `client/src/format.ts` somava as multas com `+` e o TypeScript não reclamava. `+` com string concatena: uma multa ainda é lida como número, duas viram `"01.000.75"`, que formata como `$NaN` e não é `> 0`, então o botão de pagar também some.

## Passo a passo

1. **Reproduza.** A página do Noah Ramirez diz **$NaN**.
2. **Confira os dados.** `curl http://localhost:3001/api/readers/4/loans`: `"fine": "1.00"`, uma string.
3. **Corrija o tipo** em `client/src/api/types.ts`:

   ```ts
   /** Dollars as decimal text, the way MySQL keeps them: '0.75'. */
   fine: string;
   ```

4. **Converta antes de somar** em `client/src/format.ts`:

   ```ts
   export function finesDue(loans: { returnedAt: string | null; fine: string; finePaid: boolean }[]): number {
     return loans.filter((loan) => loan.returnedAt && !loan.finePaid).reduce((total, loan) => total + Number(loan.fine), 0);
   }
   ```

Os outros lugares já leem a multa com `Number(loan.fine)`.

A referência também adiciona um teste de regressão, `client/src/reader-fines.test.tsx`: duas multas mandadas como texto somam $1.75, e a página mostra o total e o botão de pagar.

Depois rode `npm test`, abra a página do Noah e mova o cartão para **In QA**.
