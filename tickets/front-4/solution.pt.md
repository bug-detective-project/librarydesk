# Solução: Ordene os títulos como uma biblioteca arquiva

**Causa raiz.** O `sortBooks` em `client/src/collection.ts` ordena por título com `collator.compare(a.title, b.title)`, os títulos como estão escritos. A regra de arquivamento, `filingTitle`, está ali no mesmo arquivo e é usada em todo outro lugar, menos na ordem por título.

## Passo a passo

1. **Reproduza.** O acervo abre com **A Wrinkle in Time** primeiro.
2. **Ache a ordem.** `sortBooks(books, 'title')`.
3. **Compare os títulos de arquivamento:**

   ```ts
   if (by === 'title') {
     sorted.sort((a, b) => collator.compare(filingTitle(a.title), filingTitle(b.title)));
   }
   ```

A referência também adiciona um teste de regressão, `client/src/collection-filing.test.tsx`: títulos com "The", "A" e "An" arquivados pela palavra seguinte, "Theo" e "Anatomy" deixados como são, e o acervo abrindo nessa ordem.

Depois rode `npm test`, abra o acervo e mova o cartão para **In QA**.
