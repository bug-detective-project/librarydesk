# Solução: Atrasado ainda está fora

**Causa raiz.** O `findLoans` em `server/src/library.ts` filtra os atrasados só com `{ dueOn: { [Op.lt]: today() } }`. Um empréstimo que voltou mantém o prazo, então todo empréstimo devolvido cujo prazo passou aparece como atrasado.

## Passo a passo

1. **Reproduza.** `curl 'http://localhost:3001/api/loans?status=overdue'` lista empréstimos com `"returnedAt"` preenchido.
2. **Compare os dois filtros** do `findLoans`: `active` tem `returnedAt: null`; `overdue` não tem.
3. **Faça atrasado ser uma parte de emprestado:**

   ```ts
   const where = status === 'overdue' ? { dueOn: { [Op.lt]: today() }, returnedAt: null } : { returnedAt: null };
   ```

O contador do menu lê o mesmo endpoint, então também fica certo.

A referência também adiciona um teste de regressão, `server/src/loans-overdue-out.test.ts`: a lista de atrasados é exatamente os dois exemplares ainda fora, e um exemplar devolvido sai dela.

Depois rode `npm test`, abra a aba Overdue e mova o cartão para **In QA**.
