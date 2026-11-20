# Solução: Procure o empréstimo que ainda está aberto

**Causa raiz.** O `lend` em `server/src/library.ts` decide se um exemplar está emprestado olhando **um** empréstimo dele, o primeiro que já foi feito (`order: [['id', 'ASC']]`). Depois que um exemplar foi emprestado e devolvido, esse primeiro empréstimo é sempre "devolvido", então o exemplar nunca mais é recusado, esteja com quem estiver.

## Passo a passo

1. **Reproduza** com os três `curl` do ticket: o terceiro responde 201.
2. **Compare com um exemplar novo.** Para um exemplar emprestado pela primeira vez, o empréstimo mais antigo é o aberto, então a checagem funciona. Por isso o teste da Rachel passou.
3. **Leia a checagem** no `lend`: `findOne` com `order: [['id', 'ASC']]` devolve a linha mais antiga.
4. **Pergunte por um empréstimo aberto do exemplar:**

   ```ts
   if (await Loan.findOne({ where: { copyId: copy.id, returnedAt: null } })) {
     throw new ConflictError(`Copy ${copy.code} is already on loan`);
   }
   ```

A referência também adiciona um teste de regressão, `server/src/loans-one-reader-per-copy.test.ts`: um exemplar que voltou e saiu de novo é recusado para uma terceira pessoa, e um exemplar que nunca voltou também é recusado.

Depois rode `npm test`, repita os `curl` do ticket (depois de `npm run db:reset`) e mova o cartão para **In QA**.
