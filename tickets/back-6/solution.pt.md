# Solução: Uma renovação, regra por regra

A referência adiciona o `renew` ao `server/src/library.ts` e a rota dele ao `server/src/routes/loans.ts`.

## Passo a passo

1. **Escreva a ação**, ao lado do `returnLoan`, conferindo as regras na ordem do ticket e mudando a linha só no fim:

   ```ts
   export async function renew(id: unknown) {
     const loan = await loadLoan(idOf(id, 'The loan'));
     if (loan.returnedAt) {
       throw new ConflictError('This copy is already back');
     }
     const day = today();
     if (loan.dueOn < day) {
       throw new ConflictError('The loan is overdue: return the copy first');
     }
     if (loan.renewals >= MAX_RENEWALS) {
       throw new ConflictError(`A loan is renewed at most ${MAX_RENEWALS} times`);
     }
     const waiting = await Reservation.count({ where: { bookId: loan.copy!.bookId, fulfilledAt: null } });
     if (waiting > 0) {
       throw new ConflictError('Another reader is waiting for this book');
     }
     await loan.update({ dueOn: addDays(day, LOAN_DAYS), renewals: loan.renewals + 1 });
     return loanView(await loadLoan(loan.id));
   }
   ```

   O `idOf` responde 400 para um id que não é número inteiro, o `loadLoan` responde 404 para um empréstimo que não existe, e o tratador de erros do `app.ts` transforma cada `ConflictError` num 409 com a mensagem.

2. **Importe o que ela usa**: `MAX_RENEWALS` de `./fines.ts` (junto com `LOAN_DAYS`).

3. **Acrescente a rota** em `server/src/routes/loans.ts`:

   ```ts
   router.post('/loans/:id/renew', async (req, res) => {
     res.json(await renew(req.params.id));
   });
   ```

A referência também adiciona um teste de regressão, `server/src/loans-renew.test.ts`: uma renovação de 14 dias contada, o limite de duas, um empréstimo atrasado, um livro que alguém espera, um exemplar que voltou, e o 404 e o 400.

Depois rode `npm test`, clique em **Renew** em **To Kill a Mockingbird** e mova o cartão para **In QA**.
