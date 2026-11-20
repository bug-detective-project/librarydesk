# Solução: A chave diz de qual leitor são os empréstimos

**Causa raiz.** A `ReaderPage` carrega o leitor com a chave `` `reader-${id}` `` e os empréstimos com a chave `'reader-loans'`. O React Router mantém o mesmo componente quando só o `:id` do endereço muda, e o `useResource` só recarrega quando a chave muda, então o leitor é recarregado e os empréstimos não.

## Passo a passo

1. **Reproduza.** Emma Johnson, depois **Liam Carter** em Also in Grade 7: o nome muda, a tabela não.
2. **Olhe as requisições**, como o Marcus: `/api/readers/2` é pedido, `/api/readers/2/loans` não.
3. **Leia as duas chamadas de `useResource`** na `ReaderPage`: uma chave tem o id, a outra não.
4. **Ponha o id na chave:**

   ```tsx
   const loans = useResource(`reader-loans-${id}`, (signal) => getReaderLoans(id, signal));
   ```

A referência também adiciona um teste de regressão, `client/src/reader-switch.test.tsx`: ir para um colega e voltar mostra os empréstimos do leitor da página.

Depois rode `npm test`, siga os passos de novo e mova o cartão para **In QA**.
