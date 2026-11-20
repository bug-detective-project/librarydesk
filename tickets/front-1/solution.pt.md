# Solução: Conte os exemplares a cada renderização

**Causa raiz.** O `Availability` em `client/src/components/Availability.tsx` guarda o número de exemplares disponíveis em estado, iniciado com os exemplares da primeira renderização. Quando a página do livro recarrega o livro depois de um empréstimo, o componente recebe os exemplares novos como prop, mas o `useState` ignora o inicializador depois da primeira renderização, então o número nunca muda.

## Passo a passo

1. **Reproduza.** Empreste um exemplar de **To Kill a Mockingbird**: a lista e as barrinhas mudam, o número não.
2. **Ache o número.** É o `available` do `Availability`, e ele vem de um `useState`.
3. **Derive em vez de guardar:**

   ```tsx
   export function Availability({ copies }: { copies: Copy[] }) {
     const available = copies.filter((copy) => copy.status === 'available').length;
     // …
   ```

   Tire o import do `useState`.

A referência também adiciona um teste de regressão, `client/src/book-availability.test.tsx`: emprestar um exemplar tira um do contador, e emprestar o último mostra nenhum.

Depois rode `npm test`, empreste um exemplar de novo e mova o cartão para **In QA**.
